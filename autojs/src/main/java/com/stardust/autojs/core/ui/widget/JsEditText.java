package com.stardust.autojs.core.ui.widget;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Build;
import androidx.annotation.RequiresApi;
import androidx.core.content.ContextCompat;

import android.util.AttributeSet;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

/**
 * Created by Stardust on 2017/5/15.
 */

@SuppressLint("AppCompatCustomView")
public class JsEditText extends EditText {
    public JsEditText(Context context) {
        super(context);
    }

    public JsEditText(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public JsEditText(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);

    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public JsEditText(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    public String text() {
        return getText().toString();
    }

    public void text(CharSequence text) {
        setText(text);
    }

    public void hideInput() {
        InputMethodManager ipm = ContextCompat.getSystemService(getContext(), InputMethodManager.class);
        if (ipm != null) {
            ipm.hideSoftInputFromWindow(getWindowToken(), 0);
        }
    }

}
