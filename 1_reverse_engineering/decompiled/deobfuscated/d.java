/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Canvas
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 */
import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;

public final class d
extends Canvas {
    byte var_byte_a = 0;
    boolean var_boolean_a;

    public d(tribes tribes2) {
        this.setFullScreenMode(true);
    }

    public final void paint(Graphics graphics) {
        graphics.drawImage(f.var_javax_microedition_lcdui_Image_arr_a[0], -11, -8, 0);
    }

    final void a() {
        if (!this.var_boolean_a) {
            this.var_boolean_a = true;
            f.var_javax_microedition_lcdui_Image_arr_a[0] = Image.createImage((int)264, (int)352);
            f.var_javax_microedition_lcdui_Graphics_arr_a[0] = f.var_javax_microedition_lcdui_Image_arr_a[0].getGraphics();
        }
        try {
            if (this.var_byte_a < 4) {
                f.var_javax_microedition_lcdui_Graphics_arr_a[0].setColor(0xFFFFFF);
                d.b();
                f.var_javax_microedition_lcdui_Graphics_arr_a[0].drawImage(Image.createImage((String)("/l" + this.var_byte_a)), 131, 168, 3);
            }
        }
        catch (Exception exception) {}
        this.repaint();
    }

    private static void b() {
        f.var_javax_microedition_lcdui_Graphics_arr_a[0].fillRect(11, 8, 240, 321);
    }

    protected final void keyPressed(int n) {
    }
}
