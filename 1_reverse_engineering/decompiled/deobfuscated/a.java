/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.media.Manager
 *  javax.microedition.media.Player
 *  javax.microedition.media.PlayerListener
 *  javax.microedition.media.control.VolumeControl
 */
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import javax.microedition.media.Manager;
import javax.microedition.media.Player;
import javax.microedition.media.PlayerListener;
import javax.microedition.media.control.VolumeControl;

public final class a
implements PlayerListener {
    VolumeControl var_javax_microedition_media_control_VolumeControl_a;
    Player var_javax_microedition_media_Player_a;

    public a(String string) {
        try {
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(f.var_byte_arr_w, f.var_short_arr_f[f.var_byte_f], f.var_short_arr_e[f.var_byte_f]);
            this.var_javax_microedition_media_Player_a = Manager.createPlayer((InputStream)byteArrayInputStream, (String)string);
            byteArrayInputStream.close();
            this.var_javax_microedition_media_Player_a.realize();
            this.var_javax_microedition_media_Player_a.addPlayerListener((PlayerListener)this);
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void c() {
        try {
            if (this.var_javax_microedition_media_Player_a == null) {
                return;
            }
            if (this.var_javax_microedition_media_Player_a.getState() == 300) {
                this.void_a();
            }
            if (this.var_javax_microedition_media_Player_a.getState() != 400) {
                this.var_javax_microedition_media_Player_a.prefetch();
                this.var_javax_microedition_media_Player_a.start();
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    final void void_a() {
        try {
            if (this.var_javax_microedition_media_Player_a == null) {
                return;
            }
            if (this.var_javax_microedition_media_Player_a.getState() == 400) {
                this.var_javax_microedition_media_Player_a.setMediaTime(0L);
                this.var_javax_microedition_media_Player_a.stop();
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    final int int_a() {
        if (this.var_javax_microedition_media_Player_a == null) {
            return -1;
        }
        return this.var_javax_microedition_media_Player_a.getState();
    }

    final void b() {
        if (this.var_javax_microedition_media_Player_a == null) {
            return;
        }
        if (this.var_javax_microedition_media_Player_a.getState() != 0) {
            this.var_javax_microedition_media_Player_a.close();
        }
    }

    final void a(int n) {
        try {
            if (this.var_javax_microedition_media_Player_a == null) {
                return;
            }
            this.var_javax_microedition_media_control_VolumeControl_a = (VolumeControl)this.var_javax_microedition_media_Player_a.getControl("VolumeControl");
            if (n != 0) {
                if (this.var_javax_microedition_media_Player_a.getState() != 400) {
                    this.c();
                }
                this.var_javax_microedition_media_control_VolumeControl_a.setLevel(n * 20);
                return;
            }
            this.void_a();
        }
        catch (Exception exception) {}
    }

    public final void playerUpdate(Player player, String string, Object object) {
        if (string.equals("deviceUnavailable")) {
            this.void_a();
            System.currentTimeMillis();
        }
        if (string.equals("deviceAvailable")) {
            this.c();
        }
    }
}
