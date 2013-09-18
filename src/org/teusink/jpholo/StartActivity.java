package org.teusink.jpholo;

import org.apache.cordova.DroidGap;

import android.content.res.Configuration;
import android.os.Bundle;
import android.app.Activity;
import android.view.Menu;
import java.io.*;

public class StartActivity extends DroidGap {


	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
        try
        {
            String pName = this.getClass().getPackage().getName();
            this.copy("classroom_500.db","/data/data/"+pName+"/databases/");
            this.copy("0000000000000001.db","/data/data/"+pName+"/databases/file__0/");
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        super.init();
		if (checkScreenSize().equals("large") || checkScreenSize().equals("xlarge")) {
			initiateApp("tablet");
		} else {
			initiateApp("smartphone");
		}


    }

	private void initiateApp(String screenSize) {
		if (screenSize.equals("tablet")) {
			super.loadUrl("file:///android_asset/www/index_tablet.html");
		} else {
			super.loadUrl("file:///android_asset/www/index_smartphone.html");
		}
	}

	private String checkScreenSize() {
		String screenSize;
		if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_XLARGE) {
			screenSize = "xlarge";
		} else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE) {
			screenSize = "large";
		} else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_NORMAL) {
			screenSize = "normal";
		} else if ((getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_SMALL) {
			screenSize = "small";
		} else {
			screenSize = "normal";
		}
		return screenSize;
	}

    void copy(String file, String folder) throws IOException {
        File CheckDirectory;
        CheckDirectory = new File(folder);
        if (!CheckDirectory.exists())
        {
            CheckDirectory.mkdir();
        }

        InputStream in = getApplicationContext().getAssets().open(file);
        OutputStream out = new FileOutputStream(folder+file);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len; while ((len = in.read(buf)) > 0) out.write(buf, 0, len);
        in.close(); out.close();

    }
}
