// SPDX-FileCopyrightText: 2018-2021 The Manyverse Authors
//
// SPDX-License-Identifier: MPL-2.0

package se.manyver;

import android.content.Context;
import androidx.annotation.Nullable;

import com.janeasystems.rn_nodejs_mobile.RNNodeJsMobilePackage;
import com.peel.react.rnos.RNOSModule;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.scuttlebutt.bluetoothbridge.BluetoothSocketBridgeConfiguration;
import com.scuttlebutt.bluetoothbridge.BluetoothSocketBridgePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import org.acra.*;
import org.acra.annotation.*;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@AcraCore(buildConfigClass = BuildConfig.class)
@AcraMailSender(mailTo = "incoming+staltz-manyverse-6814019-issue-@incoming.gitlab.com")
@AcraDialog(resText = R.string.acra_dialog_text, resCommentPrompt = R.string.acra_dialog_comment)
public class MainApplication extends NavigationApplication {

  // Android 6.0.1 (23) really needs this:
  static {
    System.loadLibrary("sodium");
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    ACRA.init(this);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }

  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
      Context context, ReactInstanceManager reactInstanceManager) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         We use reflection here to pick up the class that initializes Flipper,
        since Flipper library is not available in release mode
        */
        Class<?> aClass = Class.forName("se.manyver.ReactNativeFlipper");
        aClass
            .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
            .invoke(null, context, reactInstanceManager);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }

  private final ReactNativeHost mReactNativeHost =
    new NavigationReactNativeHost(this) {
      @Override
      protected String getJSMainModuleName() {
        return "index.android";
      }

      @Override
      public boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
      }

      @Override
      public List<ReactPackage> getPackages() {
        ArrayList<ReactPackage> packages = new PackageList(this).getPackages();
        String socketDir = MainApplication.this.getApplicationInfo().dataDir + "/files";

        UUID uuid = UUID.fromString("b0b2e90d-0cda-4bb0-8e4b-fb165cd17d48");

        BluetoothSocketBridgeConfiguration bluetoothConfig = new BluetoothSocketBridgeConfiguration(socketDir,
          "manyverse_bt_incoming.sock", "manyverse_bt_outgoing.sock", "manyverse_bt_control.sock", "scuttlebutt", uuid);

        packages.add(new BuildConfigPackage());
        packages.add(new AsyncStoragePackage());
        packages.add(new BluetoothSocketBridgePackage(bluetoothConfig));
        packages.add(new RNNodeJsMobilePackage());
        packages.add(new RNOSModule());
        packages.add(new ReactSliderPackage());
        return packages;
      }
    };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
}
