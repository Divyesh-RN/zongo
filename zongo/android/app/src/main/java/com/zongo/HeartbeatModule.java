package com.zongo;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import android.util.Log;

import javax.annotation.Nonnull;

public class HeartbeatModule extends ReactContextBaseJavaModule {

    public static final String REACT_CLASS = "Heartbeat";
    private static ReactApplicationContext reactContext;

    public HeartbeatModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Nonnull
    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @ReactMethod
    public void startService(ReadableMap options) {
//        this.reactContext.startService(new Intent(this.reactContext, HeartbeartService.class)); for default notification
        if (!isServiceRunning(HeartbeartService.class)) {
            Intent serviceIntent = new Intent(this.reactContext, HeartbeartService.class);
            serviceIntent.putExtra("title", options.getString("title"));
            serviceIntent.putExtra("text", options.getString("text"));
            this.reactContext.startService(serviceIntent);
        }
    }

    @ReactMethod
    public void stopService() {
        if (isServiceRunning(HeartbeartService.class)) {
            this.reactContext.stopService(new Intent(this.reactContext, HeartbeartService.class));
        }
    }

    // Helper method to check if the service is running
    private boolean isServiceRunning(Class<?> serviceClass) {
        ActivityManager activityManager = (ActivityManager) reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service : activityManager.getRunningServices(Integer.MAX_VALUE)) {
            if (serviceClass.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}