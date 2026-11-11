/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Display
 *  javax.microedition.lcdui.Displayable
 *  javax.microedition.midlet.MIDlet
 */
import javax.microedition.lcdui.Display;
import javax.microedition.lcdui.Displayable;
import javax.microedition.midlet.MIDlet;

public class tribes
extends MIDlet
implements Runnable {
    f var_f_a;
    d var_d_a;
    Display var_javax_microedition_lcdui_Display_a;

    public void startApp() {
        if (this.var_f_a != null) {
            this.var_f_a.e();
            return;
        }
        this.var_javax_microedition_lcdui_Display_a = Display.getDisplay((MIDlet)this);
        Thread thread = new Thread(this);
        thread.start();
    }

    public void pauseApp() {
        if (this.var_f_a != null) {
            this.var_f_a.d();
        }
    }

    public void destroyApp(boolean bl) {
        if (this.var_f_a != null) {
            this.var_f_a.b();
        }
    }

    public void run() {
        System.gc();
        Thread.yield();
        this.var_d_a = new d(this);
        this.var_d_a.a();
        this.var_d_a.var_byte_a = 0;
        this.var_javax_microedition_lcdui_Display_a.setCurrent((Displayable)this.var_d_a);
        tribes.a(1000);
        this.var_d_a.a();
        tribes.a(2000);
        this.var_d_a.var_byte_a = 1;
        this.var_d_a.a();
        System.gc();
        Thread.yield();
        tribes.a(2000);
        this.var_d_a.var_byte_a = (byte)2;
        this.var_d_a.a();
        Thread.yield();
        this.var_d_a.var_byte_a = (byte)5;
        this.var_f_a = new f(this);
        this.var_f_a.a();
    }

    static void a(int n) {
        try {
            Thread.sleep(n);
            return;
        }
        catch (InterruptedException interruptedException) {
            return;
        }
    }
}
