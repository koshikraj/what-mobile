package com.what;

import com.facebook.react.ReactActivity;
import android.os.Bundle; // required for onCreate parameter
import com.reactnativecomponent.splashscreen.RCTSplashScreen;    //import RCTSplashScreen
import android.content.Intent; // Intent

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "what";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Get the intent that started this activity
        Intent intent = getIntent();

        // If not launched by url or app is running
        // show splash screen
        if (intent.getData() == null) {
            RCTSplashScreen.openSplashScreen(this);   //open splashscreen
            //RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.FIT_XY);   //open splashscreen fullscreen
        } 
        
        super.onCreate(savedInstanceState);    
    }
}
