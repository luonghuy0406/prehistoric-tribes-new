/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Image
 */
import java.io.DataInputStream;
import java.io.IOException;
import java.io.InputStream;
import javax.microedition.lcdui.Image;

public final class e {
    f var_f_a;
    short[] var_short_arr_a = new short[]{119, 1291, 162, 162, 2782, 144, 1069, 6903, 823, 1721, 5492, 119, 1291, 1291, 1291, 162, 162, 162, 2782, 2782, 144, 1069, 1069, 6903, 6903, 6903, 823, 1721, 42, 5492, 5492, 1810, 1810, 1810, 1810, 1810};
    byte var_byte_a;
    byte[] var_byte_arr_a = new byte[]{31, 6, 12};
    String[] var_java_lang_String_arr_a = new String[]{"/pi0", "/pi9", "/pi8"};

    public e(f f2) {
        this.var_f_a = f2;
        this.a();
        this.c();
        this.i();
        this.var_byte_a = 0;
        this.d();
        this.var_byte_a = 1;
        this.d();
        this.b();
        this.f();
        this.e();
        this.g();
        this.h();
    }

    private void a() {
        System.gc();
        Thread.yield();
        int n = 0;
        this.var_f_a.var_short_arr_arr_b = new short[11][];
        this.var_f_a.var_byte_arr_arr_j = new byte[25][];
        for (int i = 0; i <= 24; ++i) {
            this.var_f_a.var_byte_arr_arr_j[i] = new byte[this.var_short_arr_a[n + 10 + 1]];
            if (i <= 10) {
                this.var_f_a.var_short_arr_arr_b[i] = new short[this.var_short_arr_a[n]];
            }
            ++n;
        }
        System.gc();
        Thread.yield();
        this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a = new Image[3][];
        this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a[2] = new Image[1];
    }

    private void b() {
        System.gc();
        Thread.yield();
        try {
            int n;
            DataInputStream dataInputStream = new DataInputStream(this.getClass().getResourceAsStream("/pd0"));
            dataInputStream.readByte();
            int n2 = 0;
            for (int i = 0; i <= 10; ++i) {
                for (n = 0; n < this.var_short_arr_a[n2]; ++n) {
                    this.var_f_a.var_short_arr_arr_b[i][n] = dataInputStream.readShort();
                }
                ++n2;
                this.var_f_a.void_a(1);
            }
            for (n = 0; n <= 24; ++n) {
                for (int i = 0; i < this.var_short_arr_a[n2]; ++i) {
                    this.var_f_a.var_byte_arr_arr_j[n][i] = dataInputStream.readByte();
                }
                ++n2;
                this.var_f_a.void_a(1);
            }
            dataInputStream.close();
            f.aV = this.var_f_a.var_byte_arr_arr_j[23][this.var_f_a.var_short_arr_arr_b[10][this.var_f_a.var_short_arr_arr_b[9][548] & 0x1FFF] & 0x1FFF] + 9;
            f.aU = (240 - this.var_f_a.var_byte_arr_arr_j[1][1010] * 2) / f.aV;
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void c() {
        try {
            System.gc();
            Thread.yield();
            this.var_f_a.var_int_A = 288;
            this.var_f_a.var_byte_O = (byte)11;
            this.var_f_a.var_byte_P = (byte)((this.var_f_a.var_int_A - 1) / 16 + 1);
            boolean bl = false;
            this.var_f_a.var_byte_y = (byte)(this.var_f_a.var_byte_O >> 1);
            this.var_f_a.var_byte_A = (byte)(this.var_f_a.var_byte_P >> 1);
            this.var_f_a.var_byte_C = this.var_f_a.var_byte_y;
            this.var_f_a.var_byte_D = this.var_f_a.var_byte_A;
            this.var_f_a.var_int_arr_a = new int[]{264, 264, 240, 240, 240, 240, 68, 240, 68, 63, 240, 240, 240};
            this.var_f_a.var_int_arr_b = new int[]{352, 304, 22, 48, 22, 48, 55, 86, 49, 55, 38, 0, 0};
            this.var_f_a.var_int_arr_c = new int[]{0, 0, 304, 304, 326, 326, 0, 326, 0, 0, 326, 0, 0};
            this.var_f_a.var_int_arr_d = new int[]{0, 16, 0, 0, 298, 272, 0, 234, 0, 0, 282, 320, 0};
            this.var_f_a.var_byte_arr_c = new byte[]{0, 1, 0, 0, 0, 0, 2, 0, 2, 2, 0, 0, 0};
            this.var_f_a.var_byte_arr_d = new byte[]{0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
            f.var_javax_microedition_lcdui_Image_arr_a[this.var_f_a.var_byte_arr_c[1]] = Image.createImage((int)264, (int)304);
            f.var_javax_microedition_lcdui_Graphics_arr_a[this.var_f_a.var_byte_arr_c[1]] = f.var_javax_microedition_lcdui_Image_arr_a[this.var_f_a.var_byte_arr_c[1]].getGraphics();
            f.var_javax_microedition_lcdui_Image_arr_a[3] = Image.createImage((int)264, (int)304);
            f.var_javax_microedition_lcdui_Graphics_arr_a[3] = f.var_javax_microedition_lcdui_Image_arr_a[3].getGraphics();
            f.var_javax_microedition_lcdui_Image_arr_a[this.var_f_a.var_byte_arr_c[6]] = Image.createImage((int)79, (int)63);
            f.var_javax_microedition_lcdui_Graphics_arr_a[this.var_f_a.var_byte_arr_c[6]] = f.var_javax_microedition_lcdui_Image_arr_a[this.var_f_a.var_byte_arr_c[6]].getGraphics();
            this.var_f_a.bb = this.var_f_a.var_int_arr_b[2];
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void d() {
        block7: {
            System.gc();
            Thread.yield();
            byte by = this.var_byte_arr_a[this.var_byte_a];
            byte by2 = 0;
            try {
                System.gc();
                Thread.yield();
                DataInputStream dataInputStream = new DataInputStream(this.getClass().getResourceAsStream(this.var_java_lang_String_arr_a[this.var_byte_a]));
                byte[] byArray = new byte[62502];
                dataInputStream.read(byArray);
                dataInputStream.close();
                int n = 0;
                for (by2 = 0; by2 < by; by2 = (byte)(by2 + 1)) {
                    byte by3 = (byte)(byArray[n] & 0xFF);
                    ++n;
                    if (by2 == 0) {
                        this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a[this.var_byte_a] = new Image[by];
                    }
                    if (by3 == 255) break block7;
                    short s = (short)(by3 << 8 | byArray[n] & 0xFF);
                    ++n;
                    try {
                        if (by2 < 27) {
                            this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a[this.var_byte_a][by2] = Image.createImage((byte[])byArray, (int)n, (int)s);
                        }
                    }
                    catch (Exception exception) {}
                    n += s;
                    this.var_f_a.void_a(2);
                    System.gc();
                    Thread.yield();
                }
                return;
            }
            catch (Exception exception) {}
        }
    }

    private void e() {
        System.gc();
        Thread.yield();
        this.var_f_a.var_c_a = new c(this.var_f_a);
        this.var_f_a.var_c_a.var_byte_arr_f = new byte[122];
        this.var_f_a.var_c_a.var_byte_arr_e = new byte[33];
        this.var_f_a.var_c_a.var_byte_arr_arr_b = new byte[33][25];
        this.var_f_a.var_c_a.var_byte_arr_arr_c = new byte[33][25];
        this.var_f_a.var_c_a.var_byte_arr_d = new byte[33];
        this.var_f_a.var_c_a.var_short_arr_d = new short[33];
        this.var_f_a.var_c_a.var_short_arr_e = new short[33];
        this.var_f_a.var_c_a.var_short_arr_f = new short[33];
        this.var_f_a.var_c_a.var_short_arr_g = new short[250];
        this.var_f_a.var_c_a.var_short_arr_h = new short[250];
        this.var_f_a.var_c_a.b(0);
    }

    private void f() {
        System.gc();
        Thread.yield();
        this.var_f_a.var_byte_arr_a = new byte[17638];
        this.var_f_a.var_short_arr_a = new short[312];
        this.var_f_a.var_short_arr_b = new short[570];
        this.var_f_a.var_short_arr_c = new short[5];
        InputStream inputStream = null;
        try {
            inputStream = this.getClass().getResourceAsStream("/a");
            if (inputStream != null) {
                int n;
                int n2;
                int n3;
                int n4;
                this.var_f_a.var_short_arr_c[0] = 0;
                this.var_f_a.var_short_arr_a[0] = 0;
                for (n4 = 0; n4 < 312; ++n4) {
                    n3 = inputStream.read() & 0xFF;
                    n2 = inputStream.read() & 0xFF;
                    n = (n2 << 8) + n3;
                    if (n4 < 311) {
                        this.var_f_a.var_short_arr_a[n4 + 1] = (short)(this.var_f_a.var_short_arr_a[n4] + n);
                    }
                    if (n <= 0) continue;
                    inputStream.read(this.var_f_a.var_byte_arr_a, this.var_f_a.var_short_arr_a[n4], n);
                }
                for (n4 = 0; n4 < 5; ++n4) {
                    n3 = inputStream.read() & 0xFF;
                    n2 = inputStream.read() & 0xFF;
                    n = (n2 << 8) + n3;
                    if (n4 < 4) {
                        this.var_f_a.var_short_arr_c[n4 + 1] = (short)(this.var_f_a.var_short_arr_c[n4] + n);
                    }
                    for (n3 = 0; n3 < n; ++n3) {
                        n2 = inputStream.read() & 0xFF;
                        this.var_f_a.var_short_arr_b[this.var_f_a.var_short_arr_c[n4] + n3] = (short)(((inputStream.read() & 0xFF) << 8) + n2);
                    }
                }
            }
            inputStream.close();
            return;
        }
        catch (IOException iOException) {
            return;
        }
    }

    private void g() {
        try {
            System.gc();
            Thread.yield();
            f.var_short_arr_e = new short[]{8014, 6315, 5648, 3405, 3234};
            f.var_short_arr_f = new short[]{0, 8014, 14329, 19977, 23382};
            f.var_byte_arr_w = new byte[26616];
            this.var_f_a.var_byte_arr_b = new byte[]{0, 1, 2, 3, 4, 4};
            InputStream inputStream = this.getClass().getResourceAsStream("/sa");
            inputStream.read(f.var_byte_arr_w, 0, 26616);
            inputStream.close();
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void h() {
        try {
            System.gc();
            Thread.yield();
            this.var_f_a.var_int_arr_h = new int[]{0, 2545, 6965, 10649, 15487, 22633, 27261, 31708, 35466, 39214};
            this.var_f_a.var_byte_arr_v = new byte[42381];
            InputStream inputStream = this.getClass().getResourceAsStream("/ma");
            inputStream.read(this.var_f_a.var_byte_arr_v, 0, 42381);
            inputStream.close();
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void i() {
        System.gc();
        Thread.yield();
        this.var_f_a.var_byte_arr_e = new byte[9983];
        this.var_f_a.var_byte_arr_arr_b = new byte[96][96];
        this.var_f_a.var_byte_arr_arr_c = new byte[96][96];
        this.var_f_a.var_int_arr_arr_a = new int[3][4];
        try {
            this.var_f_a.var_java_lang_String_a = this.var_f_a.var_tribes_a.getAppProperty("MIDlet-Version");
            this.var_f_a.var_boolean_d = this.var_f_a.var_tribes_a.getAppProperty("GameLinkEnabled").equals("true");
            this.var_f_a.var_boolean_a = this.var_f_a.var_tribes_a.getAppProperty("Cheat-Support").equals("on");
        }
        catch (Exception exception) {}
        if (!this.var_f_a.var_boolean_d) {
            return;
        }
        this.var_f_a.getClass();
        this.var_f_a.var_byte_U = 1;
    }
}
