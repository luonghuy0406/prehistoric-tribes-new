/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Canvas
 *  javax.microedition.lcdui.Displayable
 *  javax.microedition.lcdui.Graphics
 *  javax.microedition.lcdui.Image
 *  javax.microedition.rms.RecordStore
 */
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FilterOutputStream;
import java.io.OutputStream;
import java.util.Random;
import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Displayable;
import javax.microedition.lcdui.Graphics;
import javax.microedition.lcdui.Image;
import javax.microedition.rms.RecordStore;

public final class f
extends Canvas
implements Runnable {
    static int var_int_a;
    static int var_int_b;
    boolean var_boolean_a = true;
    tribes var_tribes_a;
    b var_b_a;
    c var_c_a;
    boolean var_boolean_b;
    int var_int_c;
    int var_int_d;
    int var_int_e;
    int var_int_f;
    int var_int_g;
    int var_int_h;
    int var_int_i;
    int var_int_j = 120;
    int var_int_k = 1;
    boolean var_boolean_c;
    static byte var_byte_a;
    String var_java_lang_String_a;
    boolean var_boolean_d;
    byte var_byte_b;
    byte var_byte_c;
    byte var_byte_d;
    int var_int_l = 1;
    byte[] var_byte_arr_a;
    short[] var_short_arr_a;
    short[] var_short_arr_b;
    short[] var_short_arr_c;
    byte var_byte_e;
    static byte var_byte_f;
    static byte var_byte_g;
    byte[] var_byte_arr_b;
    a var_a_a;
    byte var_byte_h;
    int var_int_m;
    boolean var_boolean_e;
    boolean var_boolean_f;
    boolean var_boolean_g;
    boolean var_boolean_h;
    boolean var_boolean_i;
    boolean var_boolean_j;
    boolean var_boolean_k;
    byte var_byte_i;
    static boolean var_boolean_l;
    static boolean var_boolean_m;
    byte var_byte_j;
    int var_int_n;
    int var_int_o;
    int var_int_p;
    boolean var_boolean_n;
    boolean var_boolean_o;
    boolean var_boolean_p;
    byte var_byte_k;
    byte var_byte_l;
    boolean var_boolean_q;
    int var_int_q;
    int var_int_r;
    int var_int_s;
    int var_int_t;
    int var_int_u;
    boolean var_boolean_r;
    int var_int_v;
    int var_int_w;
    int var_int_x;
    int var_int_y;
    int var_int_z;
    byte var_byte_m;
    byte var_byte_n;
    byte var_byte_o;
    boolean var_boolean_s;
    byte var_byte_p;
    byte var_byte_q;
    byte var_byte_r;
    byte var_byte_s;
    byte var_byte_t;
    byte var_byte_u;
    byte var_byte_v;
    short var_short_a;
    short var_short_b;
    int var_int_A;
    int[][] var_int_arr_arr_a;
    byte var_byte_w;
    byte var_byte_x;
    byte var_byte_y;
    byte var_byte_z;
    byte var_byte_A;
    byte var_byte_B;
    byte var_byte_C;
    byte var_byte_D;
    int var_int_B;
    int var_int_C;
    int var_int_D;
    int var_int_E;
    boolean var_boolean_t;
    boolean var_boolean_u;
    byte var_byte_E;
    int var_int_F;
    int var_int_G;
    int var_int_H;
    byte var_byte_F;
    byte var_byte_G;
    byte[][] var_byte_arr_arr_a;
    boolean var_boolean_v;
    boolean var_boolean_w;
    int var_int_I;
    byte var_byte_H;
    int var_int_J;
    int var_int_K;
    int var_int_L;
    int var_int_M;
    byte var_byte_I;
    byte var_byte_J;
    byte var_byte_K;
    byte var_byte_L;
    int var_int_N;
    int var_int_O;
    int var_int_P;
    int var_int_Q;
    int var_int_R;
    int var_int_S;
    int var_int_T;
    int[] var_int_arr_a;
    int[] var_int_arr_b;
    int[] var_int_arr_c;
    int[] var_int_arr_d;
    byte[] var_byte_arr_c;
    byte[] var_byte_arr_d;
    static final Image[] var_javax_microedition_lcdui_Image_arr_a;
    static final Graphics[] var_javax_microedition_lcdui_Graphics_arr_a;
    static byte var_byte_M;
    byte var_byte_N;
    short var_short_c;
    short var_short_d;
    short var_short_e;
    short var_short_f;
    byte var_byte_O;
    byte var_byte_P;
    byte[][] var_byte_arr_arr_b;
    byte[][] var_byte_arr_arr_c;
    int[][][] var_int_arr_arr_arr_a;
    boolean[][] var_boolean_arr_arr_a;
    short[][] var_short_arr_arr_a;
    byte[] var_byte_arr_e;
    byte[][] var_byte_arr_arr_d;
    boolean var_boolean_x;
    int[] var_int_arr_e;
    byte[] var_byte_arr_f;
    byte[] var_byte_arr_g;
    byte[] var_byte_arr_h;
    byte[] var_byte_arr_i;
    byte[][] var_byte_arr_arr_e;
    byte[][][] var_byte_arr_arr_arr_a;
    byte[][] var_byte_arr_arr_f;
    byte[][][] var_byte_arr_arr_arr_b;
    byte[][][] var_byte_arr_arr_arr_c;
    int var_int_U;
    int var_int_V;
    byte[][] var_byte_arr_arr_g;
    byte[][] var_byte_arr_arr_h;
    byte[][] var_byte_arr_arr_i;
    Image[][] var_javax_microedition_lcdui_Image_arr_arr_a;
    short[][] var_short_arr_arr_b;
    byte[][] var_byte_arr_arr_j;
    int var_int_W;
    int var_int_X;
    int[][] var_int_arr_arr_b;
    int var_int_Y;
    byte var_byte_Q;
    byte var_byte_R;
    byte var_byte_S;
    int var_int_Z;
    int var_int_aa;
    int var_int_ab;
    byte var_byte_T;
    byte var_byte_U;
    byte var_byte_V;
    boolean var_boolean_y;
    byte var_byte_W;
    int var_int_ac;
    boolean var_boolean_z;
    int var_int_ad;
    int var_int_ae;
    boolean var_boolean_A;
    boolean var_boolean_B;
    boolean var_boolean_C;
    int var_int_af;
    int var_int_ag;
    int var_int_ah;
    int var_int_ai;
    int var_int_aj;
    int var_int_ak;
    int var_int_al;
    int var_int_am;
    boolean var_boolean_D;
    byte var_byte_X;
    int var_int_an;
    int var_int_ao;
    int var_int_ap;
    int var_int_aq;
    int var_int_ar;
    int var_int_as;
    int var_int_at;
    byte var_byte_Y;
    int var_int_au;
    int var_int_av;
    int var_int_aw;
    int var_int_ax;
    int var_int_ay;
    int az;
    int aA;
    int aB;
    byte var_byte_Z;
    byte var_byte_aa;
    byte var_byte_ab;
    byte var_byte_ac;
    int aC;
    boolean var_boolean_E;
    byte var_byte_ad;
    boolean[] var_boolean_arr_a;
    boolean[] var_boolean_arr_b;
    boolean[] var_boolean_arr_c;
    boolean[] var_boolean_arr_d;
    boolean var_boolean_F;
    byte[] var_byte_arr_j;
    byte[] var_byte_arr_k;
    short[] var_short_arr_d;
    int aD;
    int aE;
    int aF;
    int aG;
    int aH;
    int aI;
    int aJ;
    int aK;
    byte var_byte_ae;
    boolean var_boolean_G;
    static byte var_byte_af;
    int[] var_int_arr_f;
    byte[] var_byte_arr_l;
    byte[] var_byte_arr_m;
    byte[] var_byte_arr_n;
    byte[] var_byte_arr_o;
    static byte var_byte_ag;
    static byte var_byte_ah;
    int aL;
    int aM;
    int aN;
    int aO;
    boolean var_boolean_H;
    boolean var_boolean_I;
    int aP;
    int aQ;
    byte var_byte_ai;
    int aR;
    byte var_byte_aj;
    byte var_byte_ak;
    byte var_byte_al;
    byte var_byte_am;
    byte var_byte_an;
    int aS;
    byte[] var_byte_arr_p;
    int aT;
    byte var_byte_ao;
    boolean var_boolean_J;
    boolean var_boolean_K;
    byte var_byte_ap;
    boolean var_boolean_L;
    boolean var_boolean_M;
    boolean var_boolean_N;
    boolean var_boolean_O;
    byte var_byte_aq;
    byte[] var_byte_arr_q;
    boolean var_boolean_P;
    boolean var_boolean_Q;
    boolean var_boolean_R;
    byte var_byte_ar;
    byte var_byte_as;
    static int aU;
    static int aV;
    int aW;
    int aX;
    int aY;
    int aZ;
    byte var_byte_at;
    byte var_byte_au;
    byte var_byte_av;
    boolean var_boolean_S;
    byte[] var_byte_arr_r;
    byte[] var_byte_arr_s;
    boolean var_boolean_T;
    boolean var_boolean_U;
    boolean var_boolean_V;
    byte var_byte_aw;
    byte[] var_byte_arr_t;
    int ba;
    int bb;
    byte var_byte_ax;
    byte[] var_byte_arr_u;
    byte[][] var_byte_arr_arr_k;
    int[] var_int_arr_g;
    byte var_byte_ay;
    int[] var_int_arr_h;
    byte[] var_byte_arr_v;
    int bc;
    int bd;
    int be;
    int bf;
    String var_java_lang_String_b;
    boolean var_boolean_W;
    boolean var_boolean_X;
    Random var_java_util_Random_a;
    boolean var_boolean_Y;
    boolean var_boolean_Z;
    boolean var_boolean_aa;
    boolean var_boolean_ab;
    boolean var_boolean_ac;
    boolean var_boolean_ad;
    static short[] var_short_arr_e;
    static short[] var_short_arr_f;
    static byte[] var_byte_arr_w;
    int[] var_int_arr_i;
    int[] var_int_arr_j;
    boolean var_boolean_ae;
    boolean var_boolean_af;
    boolean var_boolean_ag;

    public f(tribes tribes2) {
        String[] stringArray = new String[]{"en", "fr", "it", "de", "es"};
        this.var_int_v = -1;
        this.var_int_w = -1;
        this.var_byte_s = (byte)-1;
        this.var_byte_t = (byte)-1;
        this.var_byte_v = (byte)2;
        this.var_boolean_t = false;
        this.var_boolean_u = false;
        this.var_boolean_v = false;
        this.var_boolean_w = false;
        this.var_byte_N = 1;
        this.var_short_c = (short)96;
        this.var_short_d = (short)96;
        this.var_short_e = (short)96;
        this.var_short_f = (short)96;
        this.var_byte_arr_g = new byte[11];
        this.var_byte_arr_h = new byte[11];
        this.var_byte_arr_i = new byte[11];
        this.var_int_U = 5;
        this.var_byte_V = (byte)4;
        this.var_int_ac = 1000;
        this.var_int_an = -1;
        this.var_boolean_arr_a = new boolean[20];
        this.var_boolean_arr_b = new boolean[20];
        this.var_boolean_arr_c = new boolean[9];
        this.var_boolean_arr_d = new boolean[9];
        this.var_byte_arr_j = new byte[8];
        this.var_int_arr_f = new int[]{0, 5251341, 16704820, 16033043, 12010496};
        this.var_byte_arr_l = new byte[]{0, 1, 1, 1, 1};
        this.var_byte_arr_m = new byte[]{0, 1, 1, 2, 3};
        this.var_byte_arr_n = new byte[]{100, 98, 0, 0, 0};
        this.var_byte_arr_o = new byte[]{5, 3, 1, 1, 1};
        this.var_byte_arr_p = new byte[40];
        this.var_byte_aq = (byte)2;
        this.var_byte_arr_q = new byte[2];
        this.var_byte_as = (byte)3;
        this.var_byte_aw = (byte)2;
        this.var_byte_arr_u = new byte[10];
        this.var_byte_arr_arr_k = new byte[3][10];
        this.var_int_arr_g = new int[10];
        this.var_java_lang_String_b = "t";
        this.var_java_util_Random_a = new Random(1L);
        this.var_boolean_Y = false;
        this.var_boolean_Z = false;
        this.var_boolean_aa = false;
        this.setFullScreenMode(true);
        this.var_tribes_a = tribes2;
    }

    public final void void_a() {
        Thread thread = new Thread(this);
        thread.start();
    }

    public final void void_b() {
        this.var_boolean_b = false;
        this.var_boolean_z = false;
        this.aR();
        this.var_tribes_a.notifyDestroyed();
    }

    private void f() {
        this.var_b_a = new b();
        System.gc();
        Thread.yield();
        new e(this);
        var_byte_af = (byte)98;
        this.void_a(0);
        this.var_tribes_a.var_javax_microedition_lcdui_Display_a.setCurrent((Displayable)this);
        this.var_boolean_y = true;
    }

    private void g() {
        System.gc();
        Thread.yield();
        this.var_byte_arr_arr_g = new byte[this.var_byte_P + 3][this.var_byte_O];
        this.var_byte_arr_arr_h = new byte[13][101];
        this.var_byte_arr_arr_i = new byte[13][101];
        this.var_int_arr_arr_arr_a = new int[2][3][96];
        this.var_boolean_arr_arr_a = new boolean[this.var_byte_P + 3][this.var_byte_O];
        System.gc();
        Thread.yield();
        this.var_byte_arr_arr_a = new byte[5][50];
        this.var_short_arr_arr_a = new short[2][26];
        this.var_byte_arr_arr_d = new byte[7][40];
        this.var_int_arr_e = new int[]{0xE00000, 14999808, 55808, 55808};
        this.var_byte_arr_f = new byte[12];
        this.var_byte_arr_arr_e = new byte[3][30];
        this.var_byte_arr_arr_arr_a = new byte[2][10][12];
        this.var_byte_arr_arr_f = new byte[4][30];
        this.var_byte_arr_arr_arr_b = new byte[2][5][30];
        this.var_byte_arr_arr_arr_c = new byte[2][5][5];
        System.gc();
        Thread.yield();
        this.var_int_arr_arr_b = new int[][]{{7250486, 11637795, 2652080, 2454300, 0x3B3B30, 0x464646, 16766976, 14352640, 10966528, 16750080, 7406848, -1}, {5276696, 8810262, 678290, 480512, 0x1D1D12, 0x282828, 16766976, -1, -1, 16750080, 0x530000, -1}};
        this.var_byte_arr_k = new byte[107];
        this.var_short_arr_d = new short[107];
        this.var_byte_arr_r = new byte[50];
        this.var_byte_arr_s = new byte[100];
        System.gc();
        Thread.yield();
        this.var_b_a.var_byte_arr_arr_arr_a = new byte[2][101][80];
        this.var_b_a.var_byte_arr_arr_arr_b = new byte[2][22][5];
        this.var_b_a.var_byte_arr_arr_arr_c = new byte[5][6][6];
        this.var_b_a.var_byte_arr_arr_a = new byte[5][50];
        this.var_b_a.var_byte_arr_c = new byte[2];
        this.var_b_a.var_byte_arr_d = new byte[6];
        this.var_b_a.var_byte_arr_e = new byte[3];
        this.var_b_a.var_byte_arr_f = new byte[3];
        this.var_b_a.var_byte_arr_arr_arr_d = new byte[3][2][96];
        this.var_b_a.var_byte_arr_g = new byte[3];
        this.var_b_a.var_byte_arr_arr_arr_e = new byte[2][3][10];
        this.var_b_a.var_byte_arr_h = new byte[10];
        this.var_b_a.var_byte_arr_arr_c = new byte[6][10];
        this.var_b_a.var_boolean_arr_a = new boolean[3];
        this.var_b_a.var_byte_arr_arr_d = new byte[2][50];
        this.var_b_a.var_short_arr_d = new short[6];
        this.var_b_a.var_byte_arr_i = new byte[8];
        this.var_b_a.var_byte_arr_arr_e = new byte[4][8];
        this.var_b_a.var_byte_arr_arr_f = new byte[2][10];
        this.var_b_a.var_byte_arr_arr_g = new byte[3][20];
        this.var_b_a.var_byte_arr_j = new byte[50];
        this.var_b_a.var_byte_arr_k = new byte[4];
        this.var_int_arr_i = new int[6];
        this.var_int_arr_j = new int[]{56, 55, 51, 57, 49};
        this.var_byte_arr_t = new byte[3];
    }

    public final void run() {
        block9: {
            try {
                this.f();
                this.g();
                this.var_b_a.a(this);
                if (!this.boolean_d(0)) {
                    this.boolean_d(1);
                    this.boolean_d(2);
                }
                this.var_byte_Q = (byte)14;
                this.var_byte_v = 0;
                this.var_boolean_H = true;
                this.var_byte_R = this.var_byte_U;
                this.var_int_v = 59;
                this.var_int_c = -1;
                this.var_byte_arr_k[55] = -1;
                this.var_int_arr_arr_a[0][3] = -1000;
                this.var_boolean_aa = true;
                this.var_boolean_b = true;
                this.i();
                while (this.var_boolean_b) {
                    long l = f.long_a();
                    this.aS();
                    this.h();
                    if (this.var_boolean_b) {
                        this.m();
                        this.l();
                        while (this.var_boolean_z && !this.var_boolean_Z) {
                            Thread.yield();
                        }
                        if (this.var_int_ad != 0 || this.var_int_ae != 0) {
                            this.var_int_ae = 0;
                            this.var_int_ad = 0;
                            tribes.a(this.var_int_i / 2);
                            this.l();
                            while (this.var_boolean_z && !this.var_boolean_Z) {
                                Thread.yield();
                            }
                        }
                        long l2 = f.long_a();
                        long l3 = l2 - l;
                        if ((l3 = (long)this.var_int_i - l3) < 0L || l3 > (long)this.var_int_i) {
                            l3 = 0L;
                        }
                        tribes.a((int)l3);
                        continue;
                    }
                    break block9;
                }
                return;
            }
            catch (Exception exception) {}
        }
    }

    private void h() {
        this.var_int_i = this.var_boolean_c ? 50 : this.var_int_j;
        this.var_int_k = this.var_int_j / this.var_int_i;
        ++this.var_int_e;
        if (this.var_int_e >= 6) {
            this.var_boolean_E = false;
            this.var_boolean_q = false;
        }
        if (this.var_int_e >= 8) {
            this.var_int_e = 0;
        }
        Thread.yield();
        if (this.var_byte_v == 0) {
            this.ak();
            this.var_boolean_o = false;
        } else if (this.var_byte_v == 1) {
            if (this.var_byte_i == 0) {
                this.var_byte_i = (byte)-1;
                if (!(this.var_byte_w == 3 || this.var_boolean_arr_a[6] || this.var_boolean_arr_a[8] || this.var_boolean_arr_a[7])) {
                    if (this.var_boolean_arr_a[0]) {
                        this.var_byte_m = 0;
                    } else if (this.var_boolean_arr_a[4]) {
                        this.var_byte_m = 1;
                        if (this.var_byte_arr_a[this.var_short_arr_a[296] + this.var_b_a.var_byte_g] == 3) {
                            this.var_b_a.var_byte_J = (byte)(120 - this.var_byte_arr_a[this.var_short_arr_a[298] + this.var_b_a.var_byte_g]);
                        }
                    }
                    this.var_byte_v = 0;
                    this.l(this.var_byte_arr_a[this.var_short_arr_a[305] + this.var_byte_arr_a[this.var_short_arr_a[306] + this.var_byte_m] + 0]);
                    this.var_byte_Q = (byte)25;
                    this.var_byte_R = (byte)28;
                    this.var_int_Z = 0;
                    this.var_boolean_H = true;
                    this.var_byte_z = this.var_byte_y;
                    this.var_byte_B = this.var_byte_A;
                    this.var_byte_J = this.var_byte_I;
                    this.var_byte_L = this.var_byte_K;
                }
            } else if (this.var_byte_w == 2 || this.var_byte_w == 4) {
                this.ae();
                this.var_boolean_o = false;
            } else {
                this.V();
                this.var_boolean_o = false;
                this.k();
            }
            if (this.var_byte_v == 1) {
                ++this.var_int_d;
                if (this.var_int_d > 5) {
                    this.var_int_d = 0;
                    this.a((byte)100, (byte)0, (byte)0, (byte)0);
                }
                if (this.var_byte_E <= 4) {
                    this.var_byte_E = (byte)(this.var_byte_E + 1);
                } else if (this.var_byte_E >= 0) {
                    this.var_int_n = 0;
                }
                this.var_byte_j = (byte)(this.var_byte_j + 1);
                this.j();
            }
        }
        ++this.var_int_g;
        ++this.var_int_f;
        if (this.var_int_f >= 120) {
            this.var_int_f = 0;
        }
        if (this.var_int_o < 3) {
            ++this.var_int_o;
            this.var_boolean_n = true;
        } else if (this.var_int_o == 3) {
            ++this.var_int_o;
            this.i();
            this.var_boolean_n = false;
        }
        if (this.var_boolean_k) {
            this.var_boolean_k = false;
            this.var_int_s = 0;
            this.l(-1);
            this.var_boolean_P = false;
            this.a(true, true, false, false);
            this.var_boolean_F = false;
            this.var_byte_w = 0;
            this.var_byte_k = 0;
            this.var_int_q = 0;
            this.var_int_E = 0;
            this.var_int_D = 0;
            this.var_int_C = 0;
            this.var_int_B = 0;
            this.var_byte_F = (byte)-1;
            this.aI();
            this.var_boolean_u = false;
            this.var_boolean_t = false;
            this.i();
        }
        if (this.var_boolean_p) {
            this.var_boolean_p = false;
            this.i();
        }
        ++this.var_int_p;
    }

    private void i() {
        var_boolean_m = false;
        var_boolean_l = false;
        this.var_boolean_h = false;
        this.var_boolean_g = false;
        this.var_boolean_f = false;
        this.var_boolean_e = false;
        this.var_boolean_v = false;
        this.var_boolean_i = false;
        this.var_byte_E = (byte)4;
        this.var_boolean_w = false;
        this.var_byte_i = (byte)-1;
        this.var_boolean_t = false;
        this.var_int_n = 0;
    }

    private void j() {
        try {
            this.var_b_a.g();
            this.var_b_a.e();
            this.var_b_a.h();
            this.var_b_a.i();
        }
        catch (Exception exception) {}
        ++this.var_int_c;
        ++this.var_int_h;
        if (this.var_int_h >= 100) {
            int n = this.var_int_h - 100;
            if (n >= this.var_short_d - 1) {
                this.var_int_h = 0;
            }
            for (int i = 0; i < this.var_short_c; ++i) {
                if (this.var_byte_arr_arr_c[n][i] > -114 || this.var_byte_arr_arr_c[n][i] <= -117) continue;
                this.var_byte_arr_arr_c[n][i] = 0;
                this.c(i, n, 1, 1);
            }
        }
        if (this.var_boolean_P && this.var_byte_w != 4 && this.var_byte_w != 3) {
            this.Z();
        }
        this.var_boolean_P = false;
        if (this.var_byte_u > 0 && this.var_byte_v == 1) {
            this.var_byte_u = (byte)(this.var_byte_u + 1);
            if (this.var_byte_u == 41 || this.var_byte_u == 90) {
                this.var_byte_v = 0;
                this.var_byte_Q = (byte)24;
                this.var_boolean_H = true;
                this.var_int_v = 56 + 41 / this.var_byte_u;
                this.var_byte_o = (byte)(11 - 41 / this.var_byte_u);
                this.var_int_o = 0;
            }
        }
    }

    private void k() {
        block10: {
            int n = this.var_byte_I + this.var_byte_y;
            int n2 = this.var_byte_K + this.var_byte_A;
            try {
                byte by = this.var_byte_arr_arr_c[n2][n];
                if (!(this.var_boolean_u || by <= -1 && by >= -30)) {
                    boolean bl = false;
                    if (by >= 51 && this.var_byte_w == 1 || by >= 1 && by <= 50) {
                        this.var_byte_W = by;
                    } else {
                        for (int i = -1; i <= 1; ++i) {
                            for (int j = -1; j <= 1; ++j) {
                                if (n + j < 0 || n2 + i < 0 || n + j >= this.var_short_c || n2 + i >= this.var_short_d || ((by = this.var_byte_arr_arr_c[n2 + i][n + j]) < 51 || this.var_byte_w != 1) && (by < 1 || by > 50)) continue;
                                int n3 = this.var_byte_arr_e[202 + by];
                                int n4 = this.var_byte_arr_e[303 + by];
                                int n5 = i < 0 ? 16 - n4 : (n4 = i == 0 ? 0 : 16 + n4);
                                n3 = j < 0 ? 22 - n3 : (j == 0 ? 0 : 22 + n3);
                                n3 = n3 * n3;
                                n4 *= n4;
                                int n6 = (n4 + n3) / 2;
                                if (this.var_byte_W == by && (n6 < 13 || by <= 50)) {
                                    this.var_int_ac = n6;
                                    bl = true;
                                }
                                if (n6 >= this.var_int_ac || n6 >= 13 && by > 50) continue;
                                this.var_int_ac = n6;
                                this.var_byte_W = by;
                                bl = true;
                            }
                        }
                        if (!bl) {
                            this.var_byte_W = 0;
                            this.var_int_ac = 1000;
                        }
                    }
                    if (this.var_byte_W < 50 && this.var_byte_w == 1) {
                        this.var_byte_W = 0;
                    }
                    break block10;
                }
                this.var_byte_W = 0;
                return;
            }
            catch (Exception exception) {}
        }
    }

    private void l() {
        this.var_boolean_z = true;
        this.repaint();
        Thread.yield();
    }

    protected final void paint(Graphics graphics) {
        if (this.var_byte_v == 1) {
            int n = this.var_int_ad == 0 && this.var_int_ae == 0 ? this.var_byte_arr_c[1] : 3;
            f.a(graphics, var_javax_microedition_lcdui_Image_arr_a[n], 0, 0, 262, this.var_int_A, this.var_short_a - 11 + this.var_int_ad, this.var_short_b - 8 + this.bb - this.var_byte_ax + this.var_int_ae + 0, 0);
            for (n = 0; n < 20; n = (int)((byte)(n + 1))) {
                if (!this.var_boolean_arr_a[n]) continue;
                f.a(graphics, var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]]], 0, this.var_int_arr_c[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]], this.var_int_arr_a[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]] + 11, this.var_int_arr_b[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]], this.var_short_a - 11, this.var_short_b + this.var_int_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]] + 0, 0);
                if (n == 8 || n == 7) {
                    this.a(graphics, 556, this.var_short_a + this.var_int_arr_a[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]] - 68, this.var_short_b + this.var_int_arr_b[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]] - 55 + this.bb + this.var_int_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + n]] + 0 + 5);
                }
                if (this.var_byte_arr_a[this.var_short_arr_a[195] + 20 + n] == 1) {
                    this.a(graphics, 524, (int)this.var_short_a, this.var_short_b + this.bb + 0);
                    continue;
                }
                if (this.var_byte_arr_a[this.var_short_arr_a[195] + 20 + n] != 2) continue;
                this.a(graphics, 528, (int)this.var_short_a, this.var_short_b + 320 - this.ba + 0);
            }
        } else {
            f.a(graphics, var_javax_microedition_lcdui_Image_arr_a[var_byte_M], 0, 0, 251, 328, this.var_short_a - 11, this.var_short_b - 8 + 0, 0);
            if (this.var_boolean_s && !this.var_boolean_J && this.aP < 0) {
                graphics.setColor(0);
                f.a(graphics, this.var_short_a - 11, this.var_short_b - 8 + 0, 240, 16 + -this.aP);
                f.a(graphics, this.var_short_a - 11, this.var_short_b - 8 + 16 + 320 - -this.aP + 0, 240, -this.aP);
            }
        }
        this.var_boolean_z = false;
    }

    private void m() {
        if (this.var_byte_v == 1) {
            this.var_byte_N = this.var_byte_arr_c[1];
            this.n();
            this.w();
            this.u();
            var_javax_microedition_lcdui_Graphics_arr_a[3].drawImage(var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], 0, 0, 0);
            this.var_byte_N = (byte)3;
            this.c(this.var_byte_y * 22 - this.var_int_ad, this.var_byte_A * 16 - this.var_int_ae);
            this.var_byte_N = this.var_byte_arr_c[1];
            this.c(this.var_byte_y * 22, this.var_byte_A * 16);
            this.var_boolean_S = false;
            for (byte by = 0; by < 20; by = (byte)((byte)(by + 1))) {
                if (!this.var_boolean_arr_a[by]) continue;
                this.a(by, 0, this.var_int_arr_c[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + by]] - 8);
                this.var_byte_N = this.var_byte_arr_c[1];
                if (this.var_byte_arr_a[this.var_short_arr_a[195] + 20 + by] == 1) {
                    this.a(524, 0, (int)this.var_byte_ax);
                    continue;
                }
                if (this.var_byte_arr_a[this.var_short_arr_a[195] + 20 + by] != 2) continue;
                this.a(528, 0, 320 - this.bb - this.ba + this.var_byte_ax);
            }
            return;
        }
        if (this.var_byte_v == 0) {
            this.F();
        }
    }

    private void n() {
        try {
            if (this.var_int_ag != 0 && this.var_int_af != 0) {
                this.var_boolean_A = true;
            }
            this.var_int_aj = 0;
            this.var_int_ak = 0;
            if (this.var_boolean_A) {
                this.var_boolean_A = false;
                this.var_boolean_C = false;
                this.var_int_al = this.var_byte_O - 1;
                this.var_int_am = this.var_byte_P - 1;
                this.var_int_ag = 0;
                this.var_int_af = 0;
                this.o();
            } else {
                this.var_int_ai = 0;
                this.var_int_am = -1;
                if (this.var_int_af != 0) {
                    this.var_int_aj = -this.var_int_af * 22;
                } else if (this.var_int_ag != 0) {
                    this.var_int_ak = -this.var_int_ag * 16;
                }
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]], var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[0]], 0, 0, 264, this.var_int_A, this.var_int_aj, this.var_int_ak, 0);
                if (this.var_int_af != 0) {
                    this.var_int_al = this.var_int_aj = ((this.var_int_af - 2) / 2 + 1) * (this.var_byte_O - 1);
                    this.var_int_ak = 0;
                    this.var_int_am = this.var_byte_P - 1;
                    this.var_int_af = 0;
                    this.o();
                }
                if (this.var_int_ag != 0) {
                    this.var_int_am = this.var_int_ak = ((this.var_int_ag - 2) / 2 + 1) * (this.var_byte_P - 1);
                    this.var_int_aj = 0;
                    this.var_int_al = this.var_byte_O - 1;
                    this.var_int_ag = 0;
                    this.o();
                }
                if (this.var_boolean_C) {
                    this.var_boolean_C = false;
                    this.var_int_aj = 0;
                    this.var_int_al = this.var_byte_O - 1;
                    this.var_int_ak = this.var_byte_P - 1 - 3;
                    this.var_int_am = this.var_byte_P - 1;
                    this.o();
                }
                if (this.var_boolean_B) {
                    this.var_boolean_B = false;
                    this.var_int_aj = 0;
                    this.var_int_al = this.var_byte_O - 1;
                    this.var_int_ak = 0;
                    this.var_int_am = this.var_byte_P - 1;
                    this.var_boolean_D = true;
                    this.o();
                    this.var_boolean_D = false;
                }
            }
            if (this.var_int_am != -1 && !this.var_boolean_s) {
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[0]], var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], 0, 0, 264, this.var_int_A, 0, 0, 0);
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void o() {
        this.var_int_ai = this.var_int_ak;
        while (this.var_int_ai <= this.var_int_am) {
            this.var_int_ah = this.var_int_aj;
            while (this.var_int_ah <= this.var_int_al) {
                block10: {
                    block9: {
                        if (!this.var_boolean_D) break block9;
                        if (!this.var_boolean_arr_arr_a[this.var_int_ai][this.var_int_ah]) break block10;
                        this.var_boolean_arr_arr_a[this.var_int_ai][this.var_int_ah] = false;
                    }
                    if (!this.var_boolean_s || this.boolean_b(this.var_int_ah + this.var_byte_I, this.var_int_ai + this.var_byte_K)) {
                        int n = this.var_byte_arr_arr_b[this.var_int_ai + this.var_byte_K][this.var_int_ah + this.var_byte_I] & 0xFF;
                        if (n < 175) {
                            this.a(n, this.var_int_ah * 22, this.var_int_ai * 16);
                        } else {
                            this.void_a(n, (byte)0);
                        }
                        byte by = this.var_byte_arr_arr_c[this.var_int_ai + this.var_byte_K][this.var_int_ah + this.var_byte_I];
                        if (by < 0 && by >= -123) {
                            this.void_a((int)by, (byte)0);
                        }
                    }
                }
                ++this.var_int_ah;
            }
            ++this.var_int_ai;
        }
    }

    private void void_a(int n, byte by) {
        int n2;
        int n3;
        int n4;
        int n5;
        int n6;
        int n7;
        int n8;
        int n9;
        block28: {
            n9 = -n;
            n8 = 0;
            byte by2 = 0;
            n7 = 0;
            n6 = 0;
            n5 = 0;
            n4 = this.var_int_ah * 22;
            n3 = this.var_int_ai * 16;
            if (f.byte_b(n) != 2) {
                n8 = this.var_byte_arr_e[8749 + n9];
                by2 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + n8];
                n7 = this.var_byte_arr_e[9115 + n9];
                n6 = this.var_int_ah + this.var_byte_I - this.var_byte_arr_e[8383 + n9];
                n5 = this.var_int_ai + this.var_byte_K - this.var_byte_arr_e[8444 + n9];
                n4 -= n6 * 22;
                n3 -= n5 * 16;
                this.var_int_N = this.var_short_arr_arr_b[0][n8 + 1];
                this.var_int_O = this.var_byte_arr_arr_j[0][n8 + 1];
                if (by == 0) {
                    int n10 = 0;
                    n2 = by2 * n5 + n6;
                    while (true) {
                        if ((this.var_byte_arr_arr_j[3][this.var_int_N] & 0xFF) >> 6 == 0) {
                            if (n10 == n2) break block28;
                            ++n10;
                        }
                        if ((this.var_byte_arr_arr_j[3][this.var_int_N] & 7) == 0) {
                            ++this.var_int_N;
                            --this.var_int_O;
                            continue;
                        }
                        break block28;
                        break;
                    }
                }
                n2 = this.var_byte_arr_e[8993 + n9];
                while (n2 > 0) {
                    this.var_byte_arr_g[this.var_byte_arr_e[4646 + n2]] = (byte)n2;
                    n2 = this.var_byte_arr_e[4545 + n2];
                }
            } else if (f.boolean_c(n)) {
                n8 = this.var_byte_arr_e[9833 + (n9 -= 61)];
                n7 = this.var_byte_arr_e[9933 + n9];
                this.var_int_N = this.var_short_arr_arr_b[0][n8 + 27 - 1];
                this.var_int_O = this.var_byte_arr_arr_j[0][n8 + 27 - 1];
            } else if (f.byte_c(n) != 2) {
                if (f.byte_c(n) != 3) {
                    this.var_byte_arr_g[0] = this.var_byte_arr_arr_c[this.var_byte_K + this.var_int_ai][this.var_byte_I + this.var_int_ah];
                    if (f.byte_c(this.var_byte_arr_g[0]) != 2) {
                        if (f.byte_c(this.var_byte_arr_g[0]) == 1) {
                            by = (byte)-1;
                        }
                        n8 = 20 - (this.var_byte_arr_g[0] + 111);
                        n7 = 1;
                    } else if (f.byte_c(this.var_byte_arr_e[4545 + this.var_byte_arr_g[0]]) != 2) {
                        n8 = 20 - (this.var_byte_arr_e[4545 + this.var_byte_arr_g[0]] + 111);
                        n7 = 2;
                    }
                    while (n8 > 22) {
                        n8 -= 3;
                    }
                } else {
                    n8 = 23;
                    n7 = 0;
                }
                this.var_int_N = this.var_short_arr_arr_b[0][n8 + 1];
                this.var_int_O = this.var_byte_arr_arr_j[0][n8 + 1];
                n9 = 0;
            } else if (n >= 1000) {
                n4 = this.var_int_S;
                n3 = this.var_int_T;
                n8 = n - 1000;
                this.var_int_N = this.var_short_arr_arr_b[0][n8];
                this.var_int_O = this.var_byte_arr_arr_j[0][n8];
                if (this.var_byte_v == 0) {
                    this.var_byte_arr_g[0] = 1;
                    this.var_byte_arr_g[1] = 2;
                    this.var_byte_arr_g[2] = 3;
                    this.var_byte_arr_e[2930] = 39;
                    this.var_byte_arr_e[2931] = 42;
                    this.var_byte_arr_e[2932] = 42;
                    this.var_byte_arr_e[607] = 1;
                    this.var_byte_arr_e[608] = 0;
                    this.var_byte_arr_e[609] = 6;
                    this.var_byte_arr_e[1415] = 25;
                    this.var_byte_arr_e[1416] = 45;
                    this.var_byte_arr_e[1417] = 70;
                    this.var_byte_arr_e[3031] = (byte)(this.var_int_f % 8);
                    this.var_byte_arr_e[3032] = (byte)(this.var_int_f % 8);
                    this.var_byte_arr_e[3033] = (byte)(this.var_int_f % 10);
                    this.var_byte_arr_e[5152] = 8;
                    this.var_byte_arr_e[6566] = 9;
                    this.var_byte_arr_e[5153] = 5;
                    this.var_byte_arr_e[6567] = 2;
                    this.var_byte_arr_e[5154] = 10;
                    this.var_byte_arr_e[6568] = 0;
                    this.var_byte_arr_e[1316] = 0;
                    this.var_byte_arr_e[1315] = 0;
                    this.var_byte_arr_e[1314] = 0;
                    this.var_byte_arr_e[6467] = 0;
                    this.var_byte_arr_e[6466] = 0;
                    this.var_byte_arr_e[6465] = 0;
                }
                n7 = 0;
                n9 = 0;
            } else if (n >= 175) {
                n8 = n - 180 + 34;
                this.var_int_N = this.var_short_arr_arr_b[0][n8];
                this.var_int_O = this.var_byte_arr_arr_j[0][n8];
                n3 += this.aQ;
                n7 = 0;
                n9 = 0;
            }
        }
        if (by == 0) {
            do {
                this.var_int_P = (this.var_byte_arr_arr_j[3][this.var_int_N] & 0xFF) >> 6;
                if (this.var_int_P <= n7) {
                    this.a(this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF, (this.var_int_ah - n6) * 22 + this.var_byte_arr_arr_j[1][this.var_int_N], (this.var_int_ai - n5) * 16 + this.var_byte_arr_arr_j[2][this.var_int_N]);
                }
                ++this.var_int_N;
            } while ((this.var_byte_arr_arr_j[3][this.var_int_N] & 7) == 0 && (this.var_byte_arr_arr_j[3][this.var_int_N] & 0xFF) >> 6 != 0);
        } else {
            this.a(n9, (byte)n7, (byte)n8, n4, n3, by);
        }
        for (n2 = 0; n2 < 8; n2 = (int)((byte)(n2 + 1))) {
            this.var_byte_arr_i[n2] = 0;
            this.var_byte_arr_h[n2] = 0;
            this.var_byte_arr_g[n2] = 0;
        }
    }

    private void a(int n, byte by, byte by2, int n2, int n3, byte by3) {
        int n4 = 0;
        int n5 = this.var_int_f;
        byte by4 = 0;
        this.var_int_U = 0;
        try {
            for (int i = 0; i < this.var_int_O; ++i) {
                int n6 = this.var_byte_arr_arr_j[3][this.var_int_N] & 7;
                by4 = (byte)((this.var_byte_arr_arr_j[3][this.var_int_N] & 0x3F) >> 3);
                this.var_int_P = (this.var_byte_arr_arr_j[3][this.var_int_N] & 0xFF) >> 6;
                this.var_byte_X = this.var_byte_arr_g[by4];
                boolean bl = false;
                int n7 = (this.var_short_arr_arr_b[1][this.var_int_N] & 0xC000) >> 14 << 7;
                if (n6 == 0 && by3 == 2 && this.var_int_P == by) {
                    this.a(this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF, n2 + this.var_byte_arr_arr_j[1][this.var_int_N] + n7, n3 + this.var_byte_arr_arr_j[2][this.var_int_N]);
                } else if (n6 == 1 && this.var_int_P <= by) {
                    if (by2 == 6 && this.var_int_U < 5) {
                        this.var_short_arr_arr_a[0][this.var_byte_arr_a[this.var_short_arr_a[142]]] = (byte)(this.var_short_arr_arr_a[0][5] + this.var_short_arr_arr_a[0][8] + this.var_short_arr_arr_a[0][5] + this.var_short_arr_arr_a[0][9] + this.var_short_arr_arr_a[0][10]);
                        if (this.var_short_arr_arr_a[0][this.var_byte_arr_a[this.var_short_arr_a[142] + this.var_int_U]] > 0 || n >= 31) {
                            this.var_int_V = this.var_short_arr_arr_a[0][this.var_byte_arr_a[this.var_short_arr_a[142] + this.var_int_U]] / 7 / (this.var_int_U == 0 ? 1 : 10);
                            if (this.var_int_V >= 5 || n >= 31) {
                                this.var_int_V = 4;
                            }
                            this.a((this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF) + this.var_int_V, n2 + this.var_byte_arr_arr_j[1][this.var_int_N] + n7, n3 + this.var_byte_arr_arr_j[2][this.var_int_N]);
                        }
                        ++this.var_int_U;
                    } else if (by2 == 4 && this.var_int_U < 1) {
                        if (n >= 31) {
                            this.a((this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF) + 2, n2 + this.var_byte_arr_arr_j[1][this.var_int_N] + n7, n3 + this.var_byte_arr_arr_j[2][this.var_int_N]);
                        } else if (this.var_short_arr_arr_a[0][0] >= 5) {
                            this.var_int_V = this.var_short_arr_arr_a[0][0] > 35 ? 2 : (this.var_short_arr_arr_a[0][0] - 5) / 15;
                            this.a((this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF) + this.var_int_V, n2 + this.var_byte_arr_arr_j[1][this.var_int_N] + n7, n3 + this.var_byte_arr_arr_j[2][this.var_int_N]);
                        }
                        ++this.var_int_U;
                    } else {
                        this.a(this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF, n2 + this.var_byte_arr_arr_j[1][this.var_int_N] + n7, n3 + this.var_byte_arr_arr_j[2][this.var_int_N]);
                    }
                } else if ((n6 == 2 || n6 == 4 || n6 == 6) && by3 != 2) {
                    if (this.var_int_P == 0 || this.var_int_P <= by) {
                        int n8 = this.var_int_N;
                        n4 = this.var_short_arr_arr_b[1][this.var_int_N] & 0xFFF;
                        if (n6 == 6) {
                            n5 += this.var_byte_K + this.var_int_ai + this.var_int_N * 2;
                            while (n5 >= 120) {
                                n5 -= 120;
                            }
                            if (by4 == 1 || by4 == 2 && (this.var_byte_arr_e[8627 + n] == 1 || this.var_byte_arr_e[8627 + n] == 2)) {
                                if (n >= 31) {
                                    ++n4;
                                }
                                bl = true;
                            } else if (by4 != 2) {
                                bl = true;
                            }
                        } else if (this.var_byte_q == 3 && n == 31 && by4 == 0) {
                            if (n4 == 116 && n6 == 4) {
                                bl = true;
                                n5 = 0;
                            }
                        } else if (n6 == 2 && (this.var_byte_arr_e[1313 + this.var_byte_X] <= 0 || this.var_byte_arr_e[1313 + this.var_byte_X] >= 50)) {
                            bl = true;
                            if (this.var_byte_arr_e[1313 + this.var_byte_X] == 51) {
                                this.var_byte_arr_i[by4] = 1;
                            }
                        } else if (n6 == 4 && this.var_byte_arr_i[by4] == 0 && this.var_byte_arr_e[1313 + this.var_byte_X] >= 1 && this.var_byte_arr_e[1313 + this.var_byte_X] != 50) {
                            n4 = this.var_short_arr_arr_b[1][this.var_int_N + this.var_byte_arr_e[1313 + this.var_byte_X] - 1] & 0xFFF;
                            n5 = this.var_byte_arr_e[3030 + this.var_byte_X];
                            bl = true;
                            this.var_byte_arr_i[by4] = 1;
                            if (this.var_byte_arr_e[8749 + n] == 2 && this.var_byte_arr_e[1313 + this.var_byte_X] == 2) {
                                this.d(90, n2 + this.var_byte_arr_arr_j[1][n8] + n7, n3 + this.var_byte_arr_arr_j[2][n8], this.var_int_f);
                            }
                        }
                        if (bl) {
                            this.d(n4, n2 + this.var_byte_arr_arr_j[1][n8] + n7, n3 + this.var_byte_arr_arr_j[2][n8], n5);
                        }
                    }
                } else if ((n6 == 3 || n6 == 5 || n6 == 7) && this.var_byte_arr_h[by4] == 0 && this.var_byte_X > 0 && by3 != 2) {
                    int n9 = 0;
                    if (n < 31 || (this.var_byte_arr_e[9176 + n] & 3) >= 2) {
                        if (n6 == 7 && this.var_byte_arr_e[1313 + this.var_byte_X] == 50) {
                            bl = true;
                        } else if (n6 == 3 && this.var_byte_arr_e[1313 + this.var_byte_X] >= 1 && this.var_byte_arr_e[1313 + this.var_byte_X] != 50) {
                            n9 = this.var_byte_arr_a[this.var_short_arr_a[139] + this.var_byte_arr_a[this.var_short_arr_a[140] + by2] + by4];
                            switch (n9) {
                                case -1: {
                                    n9 = this.var_byte_arr_e[606 + this.var_byte_X];
                                }
                            }
                            bl = true;
                        } else if (n6 == 5 && this.var_byte_arr_e[1313 + this.var_byte_X] <= 0) {
                            bl = true;
                            if ((this.var_byte_arr_e[3535 + this.var_byte_X] != 0 || this.var_byte_arr_e[6565 + this.var_byte_X] == 1) && by2 != 10 && by2 != 11) {
                                this.var_boolean_x = true;
                            }
                            if (this.var_byte_v == 0) {
                                n9 = this.var_byte_arr_e[606 + this.var_byte_X];
                            }
                        }
                    }
                    if (bl) {
                        this.a((int)this.var_byte_X, n2 + this.var_byte_arr_arr_j[1][this.var_int_N] + n7, n3 + this.var_byte_arr_arr_j[2][this.var_int_N], n9, (byte)29);
                        this.var_byte_arr_h[by4] = 1;
                    }
                }
                ++this.var_int_N;
            }
        }
        catch (Exception exception) {}
        this.var_byte_X = 0;
    }

    private void a(int n, int n2, int n3, int n4, byte by) {
        try {
            this.var_int_aq = n;
            this.var_int_ar = n2;
            this.var_int_as = n3;
            this.var_int_at = n4;
            this.var_byte_Y = by;
            this.var_int_av = this.var_byte_arr_e[this.var_short_arr_b[this.var_byte_Y] + this.var_int_aq] & 0xFF;
            int n5 = 0;
            if (this.var_int_at >= 0) {
                this.var_int_at = this.var_byte_arr_a[this.var_short_arr_a[99] + ((this.var_short_arr_arr_b[3][this.var_int_av] >> 14 & 3) << 3) + this.var_int_at];
                n5 = (this.var_short_arr_arr_b[2][this.var_int_av] & 0xFFF) + this.var_int_at * this.var_byte_arr_arr_j[4][this.var_int_av] + this.var_byte_arr_e[this.var_short_arr_b[this.var_byte_Y + 1] + this.var_int_aq];
                this.var_int_au = this.var_short_arr_arr_b[4][n5];
                this.var_int_ar += this.var_byte_arr_arr_j[7][n5];
                this.var_int_as += this.var_byte_arr_arr_j[8][n5] + this.aQ;
                if (this.var_boolean_x) {
                    if (this.var_int_av != 124) {
                        this.var_int_au += 48;
                        this.var_int_av = 1;
                    }
                    this.var_boolean_x = false;
                }
                if (this.var_int_av == 141 || this.var_int_av == 142 || this.var_int_av == 143 || this.var_int_av == 144) {
                    this.var_int_ar += 22 * this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[606 + this.var_int_aq]];
                }
            } else {
                this.var_int_av = -this.var_int_at;
                if (this.var_byte_arr_e[1414 + this.var_int_aq] < 12) {
                    this.var_int_av = 14;
                    this.var_int_as -= 6;
                }
                this.var_int_au = this.var_short_arr_arr_b[4][(this.var_short_arr_arr_b[2][this.var_int_av] & 0xFFF) + 2];
            }
            this.var_int_aw = (this.var_short_arr_arr_b[2][this.var_int_av] & 0xF000) >> 14;
            this.p();
            if (this.var_byte_v != 0) {
                this.q();
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void p() {
        this.aA = this.var_short_arr_arr_b[8][this.var_int_au];
        this.var_int_ao = -1;
        this.var_int_ap = -1;
        this.aB = 0;
        while (this.aB < this.var_byte_arr_arr_j[15][this.var_int_au]) {
            block6: {
                block12: {
                    block7: {
                        block9: {
                            block11: {
                                block10: {
                                    block8: {
                                        this.az = this.aA + this.aB;
                                        if (this.var_short_arr_arr_b[7][this.az] == 0) break block6;
                                        this.var_int_ax = 0;
                                        this.var_int_ay = this.var_byte_arr_arr_j[14][this.az] & 0xF;
                                        if (this.var_byte_Y != 29) break block7;
                                        if (!this.boolean_a()) break block6;
                                        if (this.var_byte_arr_e[1414 + this.var_int_aq] < 12) break block8;
                                        if (this.var_int_aq >= 51) {
                                            this.var_int_an = 4;
                                        }
                                        if (this.boolean_b()) break block9;
                                        break block6;
                                    }
                                    if (this.var_int_ay == 7 && this.var_byte_arr_e[1515 + this.var_int_aq] == 0) break block6;
                                    if (this.var_int_ay != 0) break block10;
                                    this.var_int_ap = this.az;
                                    if (this.var_int_aq >= 51) {
                                        ++this.var_int_ax;
                                    }
                                    break block9;
                                }
                                if (this.var_int_ay != 9) break block11;
                                this.var_int_ao = this.az;
                                this.var_int_ax = this.var_byte_arr_e[5151 + this.var_int_aq] & 1;
                                break block9;
                            }
                            if (this.var_int_ay == 5) break block6;
                        }
                        if (this.var_short_arr_arr_b[7][this.az] != 1) break block12;
                        break block6;
                    }
                    if (this.var_int_ay == 0) {
                        this.var_int_ao = this.var_int_ap = this.az;
                    }
                }
                if ((this.var_byte_arr_arr_j[14][this.az] & 0xFF) >> 7 == 0) {
                    this.b(this.var_short_arr_arr_b[7][this.az] + this.var_int_ax, this.var_int_ar + this.var_byte_arr_arr_j[12][this.az], this.var_int_as + this.var_byte_arr_arr_j[13][this.az]);
                } else {
                    this.a(this.var_short_arr_arr_b[7][this.az] + this.var_int_ax, this.var_int_ar + this.var_byte_arr_arr_j[12][this.az], this.var_int_as + this.var_byte_arr_arr_j[13][this.az]);
                }
                this.var_int_an = -1;
            }
            ++this.aB;
        }
    }

    private boolean boolean_a() {
        if (this.var_int_ay == 10 && !this.var_boolean_s && this.var_byte_v == 1 && this.var_int_at > -1) {
            if (this.var_byte_arr_e[909 + this.var_int_aq] != 0 && this.var_byte_arr_e[909 + this.var_int_aq] == this.var_byte_F || this.var_byte_F == -1 && this.var_byte_k == this.var_int_aq) {
                this.a(599, this.var_int_ar + this.var_byte_arr_arr_j[12][this.az], this.var_int_as + this.var_byte_arr_arr_j[13][this.az]);
            } else if (this.var_byte_W == this.var_int_aq) {
                this.var_int_ax = 1;
                if (this.var_byte_W >= 51) {
                    this.var_int_ax = 3;
                }
            }
            this.aC = 0;
            for (int i = this.var_int_C + 1; i <= this.var_int_C + this.var_int_E; ++i) {
                for (int j = this.var_int_B + 1; j <= this.var_int_B + this.var_int_D; ++j) {
                    byte by = this.var_byte_arr_arr_c[i][j];
                    if (by < 1 || by > 50 || this.var_byte_arr_e[1919 + by] <= 0) continue;
                    ++this.aC;
                    if (by != this.var_int_aq) continue;
                    this.var_int_ax = 1;
                }
            }
        }
        return true;
    }

    private boolean boolean_b() {
        if (this.var_int_ay == 0) {
            this.var_int_ap = this.az;
            this.var_int_ax = 0;
            this.var_int_ax = this.var_byte_arr_e[5151 + this.var_int_aq] >> 2 & 3;
            if (this.var_int_ax > 1) {
                this.var_int_ax -= 2;
                this.var_int_an = 0;
            }
            this.var_int_ax *= 72;
            if (this.var_int_aq >= 51) {
                this.var_int_ax += 36;
            }
            this.var_int_ax += this.var_byte_arr_e[1515 + this.var_int_aq] * 18;
        } else if (this.var_int_ay == 9) {
            this.var_int_ao = this.az;
            this.var_int_ax = 0;
            this.var_int_ax = this.var_byte_arr_e[5151 + this.var_int_aq] & 3;
            if (this.var_int_aq >= 51) {
                this.var_int_an = 3;
            } else if (this.var_int_ax > 0) {
                this.var_int_an = this.var_int_ax;
            }
            this.var_int_ax = this.var_byte_arr_e[1515 + this.var_int_aq] == 1 ? 1 : (this.var_byte_arr_e[1414 + this.var_int_aq] < 30 ? 3 : (this.var_byte_arr_e[1414 + this.var_int_aq] < 50 ? 2 : 0));
            this.var_int_ax *= 12;
        } else if (this.var_int_ay == 7) {
            if (this.var_int_aq == this.var_short_arr_arr_a[0][17]) {
                this.var_int_ax += 2;
            } else {
                if (this.var_byte_arr_a[this.var_short_arr_a[42] + this.var_byte_arr_a[this.var_short_arr_a[41] + this.var_byte_arr_e[6464 + this.var_int_aq]]] == 0) {
                    return false;
                }
                this.var_int_ax += this.var_byte_arr_a[this.var_short_arr_a[42] + this.var_byte_arr_a[this.var_short_arr_a[41] + this.var_byte_arr_e[6464 + this.var_int_aq]]] - 1;
            }
        } else if (this.var_int_aw == 0 && this.var_int_ay >= 5 && this.var_int_ay <= 8) {
            if (this.var_int_at < 0 && this.var_byte_arr_e[6565 + this.var_int_aq] == 1) {
                return false;
            }
            if (this.var_int_ay == 5 && this.var_byte_arr_e[6565 + this.var_int_aq] == 4 || this.var_int_ay == 6 && this.var_byte_arr_e[6565 + this.var_int_aq] == 5) {
                this.var_int_ax = 1;
            } else if (this.var_byte_arr_a[this.var_short_arr_a[145] + this.var_byte_arr_e[6565 + this.var_int_aq]] != this.var_int_ay) {
                return false;
            }
        } else if (this.var_int_aw == 2) {
            if (this.var_byte_arr_e[3535 + this.var_int_aq] != 0) {
                if (this.var_int_ay == 4 && (this.var_byte_arr_e[3636 + this.var_int_aq] > 0 || this.var_int_av == 113 || this.var_int_av == 114 || this.var_int_av == 115 || this.var_int_av == 116)) {
                    this.var_int_ax += this.var_byte_arr_e[3535 + this.var_int_aq];
                } else if (this.var_int_ay == 5) {
                    if (this.var_byte_arr_e[6565 + this.var_int_aq] == 9) {
                        return false;
                    }
                    this.var_int_ax += this.var_byte_arr_e[6565 + this.var_int_aq];
                } else if (this.var_int_ay == 8) {
                    return false;
                }
            } else if (this.var_byte_arr_e[3535 + this.var_int_aq] == 0) {
                if (this.var_int_ay == 4) {
                    return false;
                }
                if (this.var_int_ay == 5) {
                    if (this.var_byte_arr_e[6565 + this.var_int_aq] == 1) {
                        return false;
                    }
                    if (this.var_byte_arr_e[6565 + this.var_int_aq] == 9) {
                        return false;
                    }
                    this.var_int_ax += this.var_byte_arr_e[6565 + this.var_int_aq];
                } else if (this.var_int_ay == 8 && this.var_byte_arr_e[6565 + this.var_int_aq] != 1) {
                    return false;
                }
            }
        } else if (this.var_int_aw == 1 && this.var_int_ay == 5) {
            if (this.var_byte_arr_e[6565 + this.var_int_aq] == 9) {
                return false;
            }
            this.var_int_ax += this.var_byte_arr_e[6565 + this.var_int_aq];
        }
        return true;
    }

    private void q() {
        if (!this.var_boolean_s && this.var_int_ao >= 0 && this.var_int_ap >= 0 && this.var_byte_v == 1) {
            this.var_c_a.a(this.var_byte_Y == 29 ? this.var_int_aq : 101 + this.var_int_aq, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao] + 4, this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao]);
            if (this.var_byte_Y == 29 && this.var_int_at > -1) {
                int n;
                for (n = 0; n < 30; ++n) {
                    if (this.var_byte_arr_arr_arr_b[0][2][n] != this.var_int_aq || this.var_byte_arr_arr_arr_b[0][1][n] == 3) continue;
                    this.d(65 + (1 - this.var_byte_arr_arr_arr_b[0][4][n]) * 5 + this.var_byte_arr_arr_arr_b[0][1][n], this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ap], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ap], this.var_int_f);
                    break;
                }
                if (this.var_byte_arr_e[4646 + this.var_int_aq] == 1 && this.var_byte_arr_e[2828 + this.var_int_aq] == 51 && this.var_byte_arr_e[1313 + this.var_int_aq] > 0) {
                    this.d(65, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ap], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ap], this.var_int_f);
                }
                if (this.var_byte_arr_e[3333 + this.var_int_aq] > -1) {
                    this.d(77 + this.var_byte_arr_e[3333 + this.var_int_aq], this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao], (this.var_int_c - (this.var_int_aq & 7)) % 15);
                }
                if (this.var_byte_arr_e[4646 + this.var_int_aq] < -1) {
                    this.d(-this.var_byte_arr_e[4646 + this.var_int_aq], this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ap], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ap], this.var_byte_arr_e[3030 + this.var_int_aq]);
                }
                if ((this.var_byte_arr_e[7979 + this.var_int_aq] & 4) == 4) {
                    this.d(73, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao], this.var_int_f + this.var_int_aq);
                }
                if ((this.var_byte_arr_e[7979 + this.var_int_aq] & 8) == 8) {
                    this.d(69, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ap], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ap], this.var_int_f);
                }
                if (this.var_int_aq <= 50) {
                    if (this.var_byte_aq == 0 || this.var_byte_aq == 1 && (this.var_int_aq == this.var_byte_k || this.var_int_aq == this.var_byte_W || this.var_byte_arr_e[909 + this.var_int_aq] == this.var_byte_F || this.var_int_aq == this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y] || this.var_byte_X != 0 && -this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y] == this.var_byte_arr_e[4444 + this.var_int_aq])) {
                        this.a(577 + this.var_byte_arr_e[2222 + this.var_int_aq], this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao], this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao]);
                    }
                    if (!this.var_boolean_F && this.var_byte_arr_e[1919 + this.var_int_aq] > 0 && (this.var_int_aq == this.var_byte_k || this.var_int_aq == this.var_byte_W || this.var_byte_arr_e[909 + this.var_int_aq] == this.var_byte_F || this.var_int_aq == this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y] || this.var_byte_arr_e[6767 + this.var_int_aq] / 3 * 2 > this.var_byte_arr_e[1919 + this.var_int_aq] || this.var_byte_X != 0 && -this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y] == this.var_byte_arr_e[4444 + this.var_int_aq])) {
                        n = this.var_byte_arr_e[6767 + this.var_int_aq] / 20;
                        int n2 = 0;
                        if (this.var_byte_arr_e[1616 + this.var_int_aq] >= 5 || this.var_byte_arr_e[1717 + this.var_int_aq] >= 5 || this.var_byte_arr_e[7575 + this.var_int_aq] > 5) {
                            n2 = 2;
                            this.a(602 + (this.var_byte_arr_e[1616 + this.var_int_aq] > this.var_byte_arr_e[1717 + this.var_int_aq] ? (this.var_byte_arr_e[1616 + this.var_int_aq] > this.var_byte_arr_e[7575 + this.var_int_aq] ? this.var_byte_arr_e[1616 + this.var_int_aq] : (this.var_byte_arr_e[1717 + this.var_int_aq] >= this.var_byte_arr_e[7575 + this.var_int_aq] ? this.var_byte_arr_e[1717 + this.var_int_aq] : this.var_byte_arr_e[7575 + this.var_int_aq] - 1)) : (this.var_byte_arr_e[1717 + this.var_int_aq] >= this.var_byte_arr_e[7575 + this.var_int_aq] ? this.var_byte_arr_e[1717 + this.var_int_aq] : this.var_byte_arr_e[7575 + this.var_int_aq] - 1)) - 5, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao] + 2 - n + 2 - 10, this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao]);
                        }
                        this.a(607 + n, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao] + n2, this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao]);
                        var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(this.var_int_arr_e[(this.var_byte_arr_e[1919 + this.var_int_aq] - 1) * 3 / this.var_byte_arr_e[6767 + this.var_int_aq]]);
                        f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ao] + 2 - n + n2, this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ao] - 4, this.var_byte_arr_a[this.var_short_arr_a[128] + n] * this.var_byte_arr_e[1919 + this.var_int_aq] / this.var_byte_arr_e[6767 + this.var_int_aq], 2);
                    }
                }
                if ((this.var_boolean_F || this.var_boolean_V) && this.var_int_aq == this.var_byte_l) {
                    this.d(41, this.var_int_ar + this.var_byte_arr_arr_j[12][this.var_int_ap] - 1, this.var_int_as + this.var_byte_arr_arr_j[13][this.var_int_ap] - 16 - 5, this.var_int_e);
                }
            }
        }
    }

    final void a(int n, int n2, int n3, int n4) {
        for (int i = 0; i < 40; ++i) {
            if (this.var_byte_arr_arr_d[0][i] != 0) continue;
            this.var_byte_arr_arr_d[1][i] = 0;
            this.var_byte_arr_arr_d[0][i] = (byte)n4;
            this.var_byte_arr_arr_d[2][i] = (byte)n3;
            this.var_byte_arr_arr_d[6][i] = (byte)n2;
            this.var_byte_arr_arr_d[5][i] = (byte)n;
            return;
        }
    }

    private void r() {
        int n = 0;
        int n2 = 0;
        int n3 = 0;
        byte by = 0;
        int n4 = 0;
        short s = 0;
        int n5 = 0;
        short s2 = 0;
        this.var_int_aq = -1;
        try {
            for (n = 0; n < 40; ++n) {
                if (this.var_byte_arr_arr_d[0][n] <= 0) continue;
                int n6 = 29;
                this.var_int_aq = this.var_byte_arr_arr_d[5][n];
                if (this.var_byte_arr_arr_d[6][n] == 1) {
                    n2 = this.var_byte_arr_e[0 + this.var_int_aq];
                    n3 = this.var_byte_arr_e[101 + this.var_int_aq];
                } else if (this.var_byte_arr_arr_d[6][n] == 2) {
                    n2 = this.var_byte_arr_e[9359 + this.var_int_aq];
                    n3 = this.var_byte_arr_e[9381 + this.var_int_aq];
                    n6 = 108;
                    this.var_byte_arr_arr_d[2][n] = 0;
                } else {
                    n2 = this.var_byte_arr_e[8383 + this.var_int_aq] + (this.var_byte_arr_arr_d[2][n] & 0xF);
                    n3 = this.var_byte_arr_e[8444 + this.var_int_aq] + (this.var_byte_arr_arr_d[2][n] >> 4 & 0xF);
                }
                if (!this.boolean_a(n2, n3) || this.byte_a(n2, n3) != 0 || this.var_byte_arr_e[1919 + this.var_int_aq] <= 0 && this.var_byte_arr_arr_d[6][n] == 1) {
                    this.var_byte_arr_arr_d[0][n] = 0;
                    return;
                }
                n2 = (n2 - this.var_byte_I) * 22;
                n3 = (n3 - this.var_byte_K) * 16;
                if (this.var_byte_arr_arr_d[6][n] == 1 || this.var_byte_arr_arr_d[6][n] == 2) {
                    by = this.var_byte_arr_e[606 + this.var_int_aq];
                    by = this.var_byte_arr_a[this.var_short_arr_a[99] + (this.var_short_arr_arr_b[3][this.var_byte_arr_e[this.var_short_arr_b[n6] + this.var_int_aq] & 0xFF] >> 14 & 3) * 8 + by];
                    n4 = (this.var_short_arr_arr_b[2][this.var_byte_arr_e[this.var_short_arr_b[n6] + this.var_int_aq] & 0xFF] & 0xFFF) + by * this.var_byte_arr_arr_j[4][this.var_byte_arr_e[this.var_short_arr_b[n6] + this.var_int_aq] & 0xFF] + this.var_byte_arr_e[this.var_short_arr_b[n6 + 1] + this.var_int_aq];
                    s = this.var_short_arr_arr_b[4][n4];
                    n5 = 0;
                    s2 = this.var_short_arr_arr_b[8][this.var_short_arr_arr_b[4][n4]];
                    for (short s3 = 0; s3 < this.var_byte_arr_arr_j[15][s] && (this.var_byte_arr_arr_j[14][n5 = s2 + s3] & 0xF) != this.var_byte_arr_arr_d[2][n]; s3 = (short)(s3 + 1)) {
                    }
                    if (this.var_byte_arr_arr_d[6][n] == 1) {
                        n2 += this.var_byte_arr_e[202 + this.var_int_aq] + this.var_byte_arr_arr_j[12][n5];
                        n3 += this.var_byte_arr_e[303 + this.var_int_aq] + this.var_byte_arr_arr_j[13][n5];
                    } else if (this.var_byte_arr_arr_d[6][n] == 2) {
                        n2 += this.var_byte_arr_e[9403 + this.var_int_aq] + this.var_byte_arr_arr_j[12][n5];
                        n3 += this.var_byte_arr_e[9425 + this.var_int_aq] + this.var_byte_arr_arr_j[13][n5];
                    }
                }
                this.d(this.var_byte_arr_arr_d[0][n], n2, n3, this.var_byte_arr_arr_d[1][n]);
                byte[] byArray = this.var_byte_arr_arr_d[1];
                int n7 = n;
                byArray[n7] = (byte)(byArray[n7] + 1);
                if (this.var_byte_arr_arr_d[1][n] < this.var_byte_arr_arr_j[9][this.var_byte_arr_arr_d[0][n]]) continue;
                this.var_byte_arr_arr_d[0][n] = 0;
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    final void void_a(int n, int n2) {
        for (int i = 0; i < 30; ++i) {
            if (this.var_byte_arr_arr_e[0][i] != 0) continue;
            this.var_byte_arr_arr_e[1][i] = 0;
            this.var_byte_arr_arr_e[2][i] = (byte)n2;
            this.var_byte_arr_arr_e[0][i] = (byte)n;
            return;
        }
    }

    private void s() {
        for (int i = 0; i < 30; ++i) {
            if (this.var_byte_arr_arr_e[0][i] == 0) continue;
            byte by = this.var_byte_arr_arr_e[0][i];
            byte by2 = this.var_byte_arr_e[8383 + by];
            int n = this.var_byte_arr_e[8444 + by] - 1;
            int n2 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + this.var_byte_arr_e[8749 + by]];
            byte by3 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + this.var_byte_arr_e[8749 + by]];
            if (this.var_byte_arr_arr_e[1][i] >= 20) {
                this.var_byte_arr_arr_e[0][i] = 0;
                if (this.var_byte_arr_arr_e[2][i] == 3) {
                    this.c((int)by, false);
                    this.var_byte_arr_e[8627 + by] = 3;
                }
                this.c(by2, n + 1, n2, by3);
                this.void_d((int)by);
            } else {
                for (int j = 0; j < by3 + 1; j += 2) {
                    for (int k = 0; k < n2; k += 2) {
                        if (!this.boolean_a(by2 + k, n + j)) continue;
                        this.d(74, (by2 + k - this.var_byte_I) * 22, (n + j - this.var_byte_K) * 16, (k * 2 + j) * 2 + this.var_byte_arr_arr_e[1][i] - 1);
                    }
                }
            }
            byte[] byArray = this.var_byte_arr_arr_e[1];
            int n3 = i;
            byArray[n3] = (byte)(byArray[n3] + 1);
        }
    }

    private boolean boolean_a(int n, int n2) {
        return n >= this.var_byte_I && n < this.var_byte_I + this.var_byte_O && n2 >= this.var_byte_K && n2 < this.var_byte_K + this.var_byte_P;
    }

    private void t() {
        for (int n = 0; n < 40; n = (int)((byte)(n + 1))) {
            this.var_byte_arr_arr_d[0][n] = 0;
        }
    }

    private void d(int n, int n2, int n3, int n4) {
        int n5 = this.var_short_arr_arr_b[5][n] + n4 % this.var_byte_arr_arr_j[9][n];
        this.a((int)this.var_short_arr_arr_b[6][n5], n2 + this.var_byte_arr_arr_j[10][n5], n3 + this.var_byte_arr_arr_j[11][n5]);
    }

    final void a(int n, int n2, int n3) {
        int n4 = this.var_short_arr_arr_b[9][n] & 0x1FFF;
        int n5 = (this.var_short_arr_arr_b[9][n] & 0xFFFF) >> 14 & 3;
        if (n5 != 0) {
            this.b((n5 - 1) * 3 + 1, n2, n3);
        }
        for (int i = n4; i < n4 + (this.var_byte_arr_arr_j[16][n] & 0x3F); ++i) {
            int n6 = this.var_short_arr_arr_b[10][i] & 0x1FFF;
            int n7 = (this.var_short_arr_arr_b[10][i] & 0xC000) >> 14 << 7;
            if ((this.var_short_arr_arr_b[10][i] & 0x2000) >> 13 == 0) {
                this.b(n6, n2 + this.var_byte_arr_arr_j[18][i] + n7, n3 + this.var_byte_arr_arr_j[19][i]);
                continue;
            }
            this.a(n6, n2 + this.var_byte_arr_arr_j[18][i] + n7, n3 + this.var_byte_arr_arr_j[19][i]);
        }
    }

    private void b(int n, int n2, int n3) {
        block18: {
            int n4;
            block15: {
                block17: {
                    block16: {
                        if (n == 0) {
                            return;
                        }
                        n4 = this.var_byte_arr_arr_j[20][n] & 0x1F;
                        n2 += 11;
                        n3 += 8;
                        if (n4 >= 27) break block15;
                        boolean bl = false;
                        if (this.var_int_an > -1) {
                            if (this.var_int_an == 0) {
                                if (n4 == 5) {
                                    n4 = this.var_int_an;
                                    bl = true;
                                }
                            } else if (this.var_int_an == 4) {
                                if (n4 == 14) {
                                    n4 = 4;
                                    bl = true;
                                } else if (n4 == 15) {
                                    n4 = 5;
                                    bl = true;
                                }
                            } else if (n4 == 9) {
                                n4 = this.var_int_an;
                                bl = true;
                            }
                        }
                        if (!bl) break block16;
                        if (f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.var_javax_microedition_lcdui_Image_arr_arr_a[1][n4], this.var_byte_arr_arr_j[21][n] & 0x7F, this.var_byte_arr_arr_j[22][n], this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n], n2, n3, 20)) break block17;
                        break block18;
                    }
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.var_javax_microedition_lcdui_Image_arr_arr_a[0][n4], this.var_byte_arr_arr_j[21][n] & 0x7F, this.var_byte_arr_arr_j[22][n], this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n], n2, n3, 20);
                }
                return;
            }
            int n5 = (this.var_byte_arr_arr_j[20][n] & 0xFF) >> 5 | (this.var_byte_arr_arr_j[21][n] & 0x80) >> 4;
            var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(this.var_byte_arr_arr_j[17][n5 * 3 + 0] & 0xFF, this.var_byte_arr_arr_j[17][n5 * 3 + 1] & 0xFF, this.var_byte_arr_arr_j[17][n5 * 3 + 2] & 0xFF);
            if (n4 == 27) {
                f.d(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F), n3 + this.var_byte_arr_arr_j[22][n], n2 + this.var_byte_arr_arr_j[23][n], n3 + this.var_byte_arr_arr_j[24][n]);
                return;
            }
            if (n4 == 28) {
                f.b(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F), n3 + this.var_byte_arr_arr_j[22][n], this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n]);
                return;
            }
            if (n4 == 29) {
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F) - 11, n3 + this.var_byte_arr_arr_j[22][n] - 8, this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n]);
                return;
            }
            if (n4 == 30) {
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F) * 4 - 11, n3 + this.var_byte_arr_arr_j[22][n] * 4 - 8, this.var_byte_arr_arr_j[23][n] * 4, this.var_byte_arr_arr_j[24][n] * 4);
            }
        }
    }

    private void a(Graphics graphics, int n, int n2, int n3) {
        int n4;
        for (int i = n4 = this.var_short_arr_arr_b[9][n] & 0x1FFF; i < n4 + (this.var_byte_arr_arr_j[16][n] & 0x3F); ++i) {
            int n5 = this.var_short_arr_arr_b[10][i] & 0x1FFF;
            int n6 = (this.var_short_arr_arr_b[10][i] & 0xC000) >> 14 << 7;
            if ((this.var_short_arr_arr_b[10][i] & 0x2000) >> 13 == 0) {
                this.b(graphics, n5, n2 + this.var_byte_arr_arr_j[18][i] + n6, n3 + this.var_byte_arr_arr_j[19][i]);
                continue;
            }
            this.a(graphics, n5, n2 + this.var_byte_arr_arr_j[18][i] + n6, n3 + this.var_byte_arr_arr_j[19][i]);
        }
    }

    private void b(Graphics graphics, int n, int n2, int n3) {
        block7: {
            if (n == 0) {
                return;
            }
            int n4 = this.var_byte_arr_arr_j[20][n] & 0x1F;
            try {
                if (n4 == 27) {
                    graphics.setColor(0);
                    f.d(graphics, n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F), n3 + this.var_byte_arr_arr_j[22][n], n2 + this.var_byte_arr_arr_j[23][n], n3 + this.var_byte_arr_arr_j[24][n]);
                    break block7;
                }
                if (n4 == 28) {
                    graphics.setColor(0);
                    f.b(graphics, n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F), n3 + this.var_byte_arr_arr_j[22][n], this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n]);
                    break block7;
                }
                if (n4 == 29) {
                    graphics.setColor(0);
                    f.a(graphics, n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F) - 11, n3 + this.var_byte_arr_arr_j[22][n] - 8, this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n]);
                    break block7;
                }
                if (n4 == 30) {
                    graphics.setColor(0);
                    f.a(graphics, n2 + (this.var_byte_arr_arr_j[21][n] & 0x7F) * 4 - 11, n3 + this.var_byte_arr_arr_j[22][n] * 4 - 8, this.var_byte_arr_arr_j[23][n] * 4, this.var_byte_arr_arr_j[24][n] * 4);
                    break block7;
                }
                f.a(graphics, this.var_javax_microedition_lcdui_Image_arr_arr_a[0][n4], this.var_byte_arr_arr_j[21][n] & 0x7F, this.var_byte_arr_arr_j[22][n], this.var_byte_arr_arr_j[23][n], this.var_byte_arr_arr_j[24][n], n2, n3, 20);
                return;
            }
            catch (Exception exception) {}
        }
    }

    private void i(int n) {
        byte by = 0;
        byte by2 = 0;
        int n2 = 0;
        int n3 = 0;
        boolean bl = true;
        try {
            do {
                if (!bl) {
                    n = this.var_byte_arr_e[6060 + n];
                }
                bl = false;
                by = this.var_byte_arr_e[7676 + n];
                n2 = 0 + (this.var_byte_arr_e[5252 + n] - this.var_byte_I) * 22 + 11 + this.var_byte_arr_e[5454 + n];
                n3 = 0 + (this.var_byte_arr_e[5353 + n] - this.var_byte_K) * 16 + 8 + this.var_byte_arr_e[5555 + n] - this.var_byte_arr_arr_h[this.var_byte_arr_e[5858 + n]][n] - 10;
                by2 = this.var_byte_arr_e[6565 + n];
                if (by2 != 1 && by2 != 2 && by2 != 5) continue;
                this.a(292 + this.var_byte_arr_a[this.var_short_arr_a[190 + this.var_byte_arr_a[this.var_short_arr_a[77] + by2]] + by * this.var_byte_arr_a[this.var_short_arr_a[193] + 6 + by2] + this.var_byte_arr_arr_i[this.var_byte_arr_e[5858 + n]][n]] + this.var_byte_arr_a[this.var_short_arr_a[193] + by2], n2, n3);
            } while (this.var_byte_arr_e[6060 + n] != 0);
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void u() {
        int n = 0;
        int n2 = -16;
        byte by = 0;
        int n3 = 0;
        try {
            block58: {
                block57: {
                    this.v();
                    this.var_int_ai = -1;
                    while (this.var_int_ai < this.var_byte_P + 3) {
                        int n4 = this.var_int_ai + this.var_byte_K;
                        if (n4 < this.var_short_d) {
                            this.var_int_ah = this.var_byte_O - 1 + 1;
                            while (this.var_int_ah >= -1) {
                                int n5 = this.var_int_ah + this.var_byte_I;
                                if (n4 >= 0 && n4 < this.var_short_d && n5 >= 0 && n5 < this.var_short_c) {
                                    n = this.var_int_ah * 22;
                                    byte by2 = this.byte_a(n5, n4);
                                    if (this.var_boolean_s && !this.var_boolean_J) {
                                        by2 = 0;
                                    }
                                    by = this.var_byte_arr_arr_c[n4][n5];
                                    n3 = this.var_byte_arr_arr_b[n4][n5] & 0xFF;
                                    if (by != 0) {
                                        if (by2 < 2 && (n3 >= 180 && n3 <= 231 || n3 == 243)) {
                                            this.void_a(n3, (byte)1);
                                        } else if (!(by2 >= 1 || by < 1 || by > 100 || this.var_boolean_s && this.var_byte_ao == 9)) {
                                            if (f.byte_c(this.var_byte_arr_e[4545 + by]) != 2) {
                                                this.void_a((int)this.var_byte_arr_e[4545 + by], (byte)1);
                                            }
                                            if (f.byte_c(this.var_byte_arr_e[4545 + by]) == 2 || this.var_byte_arr_e[2929 + by] <= 14) {
                                                if (this.var_int_ai >= 0 && this.var_int_ah - 1 >= 0 && this.var_byte_arr_e[9833 + (this.var_byte_arr_arr_c[n4][n5 - 1] + 61) * -1] == 5 && f.boolean_c(this.var_byte_arr_arr_c[n4][n5 - 1])) {
                                                    if (this.var_int_ah < this.var_byte_O) {
                                                        this.var_byte_arr_arr_g[this.var_int_ai][this.var_int_ah] = 0;
                                                    }
                                                    --this.var_int_ah;
                                                    n5 = this.var_int_ah + this.var_byte_I;
                                                    this.void_a((int)this.var_byte_arr_arr_c[n4][n5], (byte)1);
                                                }
                                                if (f.byte_a(by) == 0 || (this.var_byte_arr_e[7979 + by] & 2) == 0) {
                                                    this.a((int)by, n + this.var_byte_arr_e[202 + by], n2 + this.var_byte_arr_e[303 + by], (int)this.var_byte_arr_e[606 + by], (byte)29);
                                                }
                                            }
                                        } else if (by <= -1 && by >= -60 && (by2 < 2 || this.var_byte_arr_e[9176 + -by] > 0)) {
                                            if ((this.var_byte_arr_e[9176 + -by] & 4) != 0) {
                                                switch (by2) {
                                                    case 0: {
                                                        this.var_byte_arr_e[9176 + -by] = 6;
                                                        break;
                                                    }
                                                    case 1: {
                                                        this.var_byte_arr_e[9176 + -by] = 5;
                                                    }
                                                }
                                            }
                                            switch (this.var_byte_arr_e[9176 + -by] & 3) {
                                                case 1: {
                                                    by2 = 1;
                                                    break;
                                                }
                                                case 2: {
                                                    by2 = 0;
                                                }
                                            }
                                            if ((this.var_byte_arr_e[8871 + -by] & 1) == 0) {
                                                this.void_a((int)by, (byte)1);
                                                int n6 = 8871 + -by;
                                                this.var_byte_arr_e[n6] = (byte)(this.var_byte_arr_e[n6] | 1);
                                                byte by3 = this.var_byte_arr_e[8749 + -by];
                                                byte by4 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + by3];
                                                byte by5 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + by3];
                                                if ((this.var_byte_arr_e[9176 + -by] & 4) == 0) {
                                                    this.var_b_a.var_byte_S = 0;
                                                    this.var_b_a.a((int)this.var_byte_arr_e[8383 + -by], (int)this.var_byte_arr_e[8444 + -by], (int)by4, (int)by5);
                                                    this.var_b_a.var_byte_S = 1;
                                                    this.var_byte_arr_e[9176 + -by] = 4;
                                                }
                                                if (!this.var_boolean_s && by3 < 22) {
                                                    if ((this.var_byte_arr_a[this.var_short_arr_a[138] + 156 + by3] != -1 || this.var_byte_arr_e[8627 + -by] == 1 || this.var_byte_arr_e[8627 + -by] == 2) && this.var_byte_arr_e[8810 + -by] == 0 && f.byte_b(by) == 0) {
                                                        this.d(40, (this.var_byte_arr_e[8383 + -by] - this.var_byte_I) * 22 + by4 * 11 - 11, (this.var_byte_arr_e[8444 + -by] - this.var_byte_K) * 16 + by5 * 8 - 8, this.var_int_e);
                                                    }
                                                    if ((this.var_byte_arr_e[8505 + -by] > 0 && (by == this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y] || this.var_byte_arr_e[8566 + -by] / 2 > this.var_byte_arr_e[8505 + -by]) || this.var_byte_arr_e[8627 + -by] == 1 || this.var_byte_arr_e[8627 + -by] == 2 || by3 >= 12) && f.byte_b(by) == 0) {
                                                        int n7;
                                                        byte by6;
                                                        int n8;
                                                        int n9;
                                                        int n10 = this.var_byte_arr_e[8566 + -by] / 80 + 6;
                                                        int n11 = (this.var_byte_arr_e[8383 + -by] - this.var_byte_I) * 22 + by4 * 11 - 11;
                                                        int n12 = n2 - this.var_byte_arr_a[this.var_short_arr_a[138] + 520 + by3] * 8 - 5;
                                                        this.a(607 + n10, n11, n12);
                                                        var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(this.var_int_arr_e[(this.var_byte_arr_e[8505 + -by] - 1) * 3 / this.var_byte_arr_e[8566 + -by]]);
                                                        f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n11 + 1, n12 + 1, this.var_byte_arr_a[this.var_short_arr_a[128] + n10] * this.var_byte_arr_e[8505 + -by] / this.var_byte_arr_e[8566 + -by], 2);
                                                        if (by == this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y] && (n9 = (n8 = (by6 = this.var_b_a.a((int)(-by))) >> 4 & 0xF) + (n7 = by6 & 0xF)) > 0) {
                                                            n11 = n11 + 1 + this.var_byte_arr_a[this.var_short_arr_a[128] + n10] / 2 - 4 * n9 / 2 + 1;
                                                            var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(0);
                                                            f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n11 - 0, (n12 += 6) - 1, n9 * 4 - 1, 4);
                                                            f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n11 - 1, n12 - 0, n9 * 4 + 1, 2);
                                                            for (int n13 = 0; n13 < n9; n13 = (int)((byte)(n13 + 1))) {
                                                                var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(n13 < n7 ? 16164864 : 4207389);
                                                                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n11 + n13 * 4, n12, 3, 2);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        } else if (by2 < 1 && f.boolean_b(by)) {
                                            int n14 = by - 101;
                                            this.a(n14, n + this.var_byte_arr_e[9403 + n14], n2 + this.var_byte_arr_e[9425 + n14], (int)this.var_byte_arr_e[9491 + n14], (byte)108);
                                        } else if (by2 < 2 && (f.boolean_c(by) || f.byte_c(by) == 3)) {
                                            this.void_a((int)by, (byte)1);
                                        } else if (by2 == 0 && by <= -114 && by > -117) {
                                            if (this.var_int_h >= 94 + n4 && this.var_int_h <= 100 + n4) {
                                                this.d(75, n, n2, this.var_int_h - (100 + n4) + 6);
                                            } else if ((this.var_int_h + this.var_int_ah + this.var_int_ai) % 10 < 5) {
                                                this.a(this.var_byte_arr_arr_b[n4][n5] & 0xFF, n, n2);
                                            }
                                        }
                                    }
                                    if (this.var_int_ah >= 0 && this.var_int_ah < this.var_byte_O && this.var_int_ai >= 0 && this.var_byte_arr_arr_g[this.var_int_ai][this.var_int_ah] > 0) {
                                        this.i(this.var_byte_arr_arr_g[this.var_int_ai][this.var_int_ah]);
                                        this.var_byte_arr_arr_g[this.var_int_ai][this.var_int_ah] = 0;
                                    }
                                    if (by2 == 1) {
                                        this.b(12, n - 2, n2 - 4);
                                    } else if (by2 == 2) {
                                        var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]].setColor(0);
                                        if (n5 == 0 || n5 == this.var_short_c - 1 || n4 == 0 || n4 == this.var_short_d - 1 || this.byte_a(n5 - 1, n4) != 2 || this.byte_a(n5 + 1, n4) != 2 || this.byte_a(n5, n4 - 1) != 2 || this.byte_a(n5, n4 + 1) != 2) {
                                            this.b(11, n - 3, n2 - 2);
                                        } else {
                                            f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]], n, n2, 22, 16);
                                        }
                                    }
                                    if (this.var_int_ai == this.var_byte_A && this.var_int_ah == this.var_byte_y) {
                                        this.var_byte_Z = by2;
                                    }
                                }
                                --this.var_int_ah;
                            }
                            if ((this.var_boolean_L || this.var_boolean_N) && this.var_byte_arr_q[1] - this.var_byte_K == this.var_int_ai) {
                                this.d(105, (this.var_byte_arr_q[0] - this.var_byte_I) * 22, n2, this.var_int_f);
                            }
                            n2 += 16;
                        }
                        ++this.var_int_ai;
                    }
                    this.r();
                    this.s();
                    if (this.var_int_ad != 0 || this.var_int_ae != 0) break block57;
                    if (this.var_boolean_N) break block58;
                    if (this.var_boolean_L) {
                        this.d(31, 218, 11, this.var_int_f);
                    }
                }
                return;
            }
            this.d(30, 218, 11, this.var_int_f);
        }
        catch (Exception exception) {}
    }

    private void v() {
        int n;
        int n2;
        int n3;
        for (n3 = 1; n3 <= 60; ++n3) {
            int n4 = 8871 + n3;
            this.var_byte_arr_e[n4] = (byte)(this.var_byte_arr_e[n4] & 0xFE);
            if (this.var_byte_arr_e[9176 + n3] <= 0) continue;
            this.var_byte_arr_e[9176 + n3] = 5;
        }
        n3 = 0;
        for (n2 = 0; n2 < 5; ++n2) {
            if (this.var_byte_arr_arr_arr_c[n3][n2][2] >= 0 && this.var_byte_arr_arr_arr_c[n3][n2][3] == 1 && this.var_byte_arr_arr_arr_c[n3][n2][0] >= this.var_byte_I - 1 && this.var_byte_arr_arr_arr_c[n3][n2][0] <= this.var_byte_I + this.var_byte_O + 1 && this.var_byte_arr_arr_arr_c[n3][n2][1] >= this.var_byte_K - 1 && this.var_byte_arr_arr_arr_c[n3][n2][1] <= this.var_byte_K + this.var_byte_P + 1) {
                for (n = 0; n < 9; ++n) {
                    if (this.byte_a(this.var_byte_arr_arr_arr_c[n3][n2][0] + this.var_byte_arr_a[this.var_short_arr_a[141] + 0 + n], this.var_byte_arr_arr_arr_c[n3][n2][1] + this.var_byte_arr_a[this.var_short_arr_a[141] + 9 + n]) != 0) continue;
                    this.d(68, (this.var_byte_arr_arr_arr_c[n3][n2][0] - this.var_byte_I + this.var_byte_arr_a[this.var_short_arr_a[141] + 0 + n]) * 22, (this.var_byte_arr_arr_arr_c[n3][n2][1] - this.var_byte_K + this.var_byte_arr_a[this.var_short_arr_a[141] + 9 + n]) * 16, this.var_int_f);
                }
            }
            if (n2 != 4 || n3 != 0) continue;
            n2 = 0;
            n3 = 1;
        }
        for (n2 = 0; n2 < 30; ++n2) {
            n = this.var_byte_arr_arr_arr_b[0][2][n2];
            byte by = this.var_byte_arr_arr_arr_b[0][3][n2];
            if (this.var_byte_arr_arr_arr_b[0][1][n2] != 3 || this.var_byte_arr_arr_arr_b[0][0][n2] == 0 || n < this.var_byte_I - 1 || n > this.var_byte_I + this.var_byte_O + 1 || by < this.var_byte_K - 1 || by > this.var_byte_K + this.var_byte_P + 1 || this.byte_a(n, (int)by) != 0) continue;
            this.d(68 + (1 - this.var_byte_arr_arr_arr_b[0][4][n2]) * 5, (n - this.var_byte_I - 0) * 22, (by - this.var_byte_K - 0) * 16, this.var_int_f);
        }
    }

    private void w() {
        int n;
        int n2;
        if (this.var_boolean_u) {
            this.var_int_Q = this.var_int_G - this.var_byte_I <= this.var_byte_y ? this.var_int_G - this.var_byte_I : this.var_byte_y;
            this.var_int_B = this.var_int_Q + this.var_byte_I - 1;
            this.var_int_R = this.var_int_H - this.var_byte_K <= this.var_byte_A ? this.var_int_H - this.var_byte_K : this.var_byte_A;
            this.var_int_C = this.var_int_R + this.var_byte_K - 1;
            this.var_int_Q *= 22;
            this.var_int_R *= 16;
            n2 = this.var_byte_I + this.var_byte_y - this.var_int_G;
            n = this.var_byte_K + this.var_byte_A - this.var_int_H;
            if (n2 < 0) {
                n2 *= -1;
            }
            this.var_int_D = n2 + 1;
            if (n < 0) {
                n *= -1;
            }
            this.var_int_E = n + 1;
            n2 = (n2 + 1) * 22;
            n = (n + 1) * 16;
            var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]].setColor(0);
            f.b(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]], 11 + this.var_int_Q + 1, 8 + this.var_int_R + 1, n2, n);
            var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]].setColor(1105252);
            f.b(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]], 11 + this.var_int_Q, 8 + this.var_int_R, n2, n);
        }
        if (f.byte_b(n2 = this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y]) == 0) {
            n = (this.var_byte_arr_e[8383 + -n2] - this.var_byte_I) * 22;
            int n3 = (this.var_byte_arr_e[8444 + -n2] - this.var_byte_K) * 16;
            int n4 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + this.var_byte_arr_e[8749 + -n2]] * 22;
            int n5 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + this.var_byte_arr_e[8749 + -n2]] * 16;
            this.d(6, n, n3, this.var_int_e);
            this.d(7, n + n4, n3, this.var_int_e);
            this.d(8, n, n3 + n5, this.var_int_e);
            this.d(9, n + n4, n3 + n5, this.var_int_e);
        }
    }

    private void c(int n, int n2) {
        int n3;
        if (this.var_byte_aa != 0) {
            this.d(34 + this.var_byte_aa, (this.var_byte_ab - this.var_byte_I) * 22, (this.var_byte_ac - this.var_byte_K) * 16, this.var_int_e);
            if (this.var_int_e == 5) {
                this.var_byte_aa = 0;
            }
        }
        byte by = this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y];
        if (this.var_byte_w != 2) {
            int n4 = -1;
            n3 = 32;
            if (this.var_byte_w == 1) {
                if (this.var_byte_k != 0) {
                    n4 = 1;
                } else if (this.var_byte_F != -1) {
                    n4 = 0;
                    for (int i = 0; i < 50; ++i) {
                        if (this.var_byte_arr_arr_a[this.var_byte_F][i] == 0) continue;
                        n4 = (byte)(n4 + 1);
                    }
                }
                n3 = this.var_byte_Z == 0 && (f.byte_b(by) == 1 || f.boolean_b(by) || f.byte_a(by) == 1 && (this.var_byte_arr_e[7979 + by] & 2) == 0) ? 34 : 33;
            } else if (this.var_byte_w == 3) {
                int n5;
                if (this.var_int_s == 100) {
                    this.var_boolean_r = true;
                    n5 = 105;
                } else if (this.var_int_s < 0 || this.var_int_s <= 3) {
                    if (f.byte_a(by) == 0 && this.var_byte_arr_e[1414 + by] >= 12 || f.byte_a(this.var_byte_W) == 0 && this.var_byte_arr_e[1414 + this.var_byte_W] >= 12) {
                        this.var_int_r = this.var_byte_W;
                        this.var_int_t = this.var_byte_arr_e[0 + this.var_int_r];
                        this.var_int_u = this.var_byte_arr_e[101 + this.var_int_r];
                        this.var_boolean_r = true;
                        n5 = 33;
                    } else if (this.var_int_s == 3) {
                        this.var_boolean_r = true;
                        n5 = 33;
                    } else {
                        this.var_boolean_r = false;
                        n5 = 32;
                    }
                } else {
                    byte by2 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + this.var_int_s];
                    byte by3 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + this.var_int_s];
                    this.var_int_t = this.var_byte_y - by2 / 2;
                    this.var_int_u = this.var_byte_A - by3 / 2;
                    this.var_int_S = n - by2 / 2 * 22;
                    this.var_int_T = n2 - by3 / 2 * 16 - 5 + this.var_int_e;
                    this.void_a(1000 + this.var_int_s + 1, (byte)2);
                    this.var_boolean_r = this.a(this.var_int_s, this.var_byte_I + this.var_int_t, this.var_byte_K + this.var_int_u, true);
                    n5 = n3 = this.var_boolean_r ? 41 : 40;
                }
            }
            if (this.var_boolean_E && this.var_int_e < 2 && n3 <= 34) {
                n3 = (byte)(n3 + 5);
            }
            this.d(n3, n, n2, this.var_int_e);
            if (n4 > 0) {
                this.var_c_a.a(n + 22, n2 + 8, 0, "" + n4, 1);
                this.var_c_a.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N]);
            }
            if (this.aC > 0) {
                this.var_c_a.a(n + 22, n2 + 8, 0, "" + this.aC, 1);
                this.var_c_a.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N]);
            }
            if (this.var_byte_w == 3) {
                if (this.var_int_s < 0) {
                    this.a(659 - this.var_int_s - 1, n + 11 + 5, n2 + 8 + 5);
                } else if (this.var_int_s <= 3) {
                    this.d(this.var_int_s + 48, n, n2, this.var_int_e);
                }
            }
        }
        n3 = 0;
        if (this.var_byte_w == 1) {
            if (this.var_boolean_q && this.var_byte_aa != 0) {
                n3 = 47;
                this.var_byte_Z = 0;
            } else if (by == -124) {
                n3 = 44;
            } else if (by == -125) {
                n3 = 45;
            } else if (f.byte_b(by) == 0 && this.var_byte_arr_e[8749 + -by] != 10) {
                n3 = 41;
            } else if (f.boolean_c(by)) {
                n3 = this.var_byte_arr_e[9833 + (by + 61) * -1] == 7 ? 46 : 43;
            } else if (f.boolean_b(by) && this.var_byte_Z == 0) {
                n3 = 43;
            }
            if (n3 != 0 && this.var_byte_Z != 2) {
                this.d(n3, n, n2, this.var_int_e);
            }
        }
    }

    private void a(byte by, int n, int n2) {
        this.aD = by;
        try {
            boolean bl = this.boolean_c();
            if (this.var_boolean_arr_b[by]) {
                this.var_boolean_arr_b[17] = true;
                this.var_byte_ae = 0;
            } else if (bl) {
                this.var_byte_ae = 1;
            } else if (this.var_byte_arr_a[this.var_short_arr_a[195] + 80 + by] == 1) {
                this.var_byte_ae = (byte)2;
            } else {
                return;
            }
            this.var_byte_N = this.var_byte_arr_c[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + by]];
            this.aE = this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + by];
            byte by2 = this.var_byte_arr_a[this.var_short_arr_a[195] + 40 + by];
            boolean bl2 = false;
            for (int i = this.var_short_arr_arr_b[0][by2]; i < this.var_short_arr_arr_b[0][by2] + this.var_byte_arr_arr_j[0][by2]; ++i) {
                int n3 = (this.var_byte_arr_arr_j[3][i] & 0xFF) >> 6;
                int n4 = this.var_byte_arr_arr_j[3][i] & 7;
                this.aI = this.var_short_arr_arr_b[1][i] & 0xFFF;
                if (n3 < this.var_byte_ae && !bl2) {
                    if (n3 != 1) continue;
                    bl2 = true;
                    continue;
                }
                this.aF = 0;
                if (bl2) {
                    bl2 = false;
                    if (this.var_byte_arr_k[this.aE] == 0 && this.var_byte_ae > 0 || this.var_byte_arr_k[this.aE] < 0) {
                        ++this.aE;
                        continue;
                    }
                    this.aF = this.var_short_arr_d[this.aE];
                    this.var_byte_arr_k[this.aE] = 0;
                    ++this.aE;
                } else if (n3 == 1) {
                    bl2 = true;
                    if (this.var_byte_arr_k[this.aE] == 0 && this.var_byte_ae > 0 || this.aI == 0 || n3 < this.var_byte_ae || this.var_byte_arr_k[this.aE] < 0) {
                        continue;
                    }
                } else if (n3 == 2 && this.var_byte_arr_k[this.aE] < 0) continue;
                int n5 = (this.var_short_arr_arr_b[1][i] >> 14 & 3) << 7;
                int n6 = (this.var_short_arr_arr_b[1][i] >> 12 & 3) << 7;
                this.aJ = this.var_byte_arr_arr_j[1][i];
                this.aK = this.var_byte_arr_arr_j[2][i];
                if (by >= 13 && by <= 16) {
                    this.aJ += 120;
                    this.aK += 110;
                } else {
                    this.aJ += n;
                    this.aK += n2;
                }
                this.aJ += n5;
                this.aK += n6;
                if (i == 1011) {
                    this.aI = this.var_short_arr_arr_b[1][1007] & 0xFFF;
                    this.aF = this.var_short_arr_d[3];
                    this.d(n4, 1007);
                    this.aI = 0;
                }
                if (i == 1010) {
                    this.a(i, this.var_byte_ae, this.aK);
                    continue;
                }
                if (i == 1137) {
                    this.c(i, this.aJ, this.aK);
                    continue;
                }
                if (n4 == 0 && (this.var_byte_arr_arr_j[3][i] & 0xFF) >> 6 == 3) {
                    var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(0);
                    int n7 = 99;
                    if (i == 1030) {
                        n7 = this.var_byte_arr_e[6767 + this.var_byte_l];
                    }
                    if (this.aF < 0) continue;
                    int n8 = this.var_byte_arr_arr_j[23][this.aI] * this.aF / n7;
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.var_byte_arr_arr_j[1][i] + n8 + 1, this.aK, this.var_byte_arr_arr_j[23][this.aI] - n8 + n6, 4);
                    continue;
                }
                if (n4 == 3 && this.aI >= 3 && this.aI <= 4) {
                    if (this.var_int_v == -1) continue;
                    if (this.var_boolean_arr_b[by] || this.var_int_v != this.var_int_w) {
                        this.var_c_a.b(this.aG, this.aH, this.var_byte_arr_arr_j[23][this.var_short_arr_arr_b[1][i - 1] & 0xFFF] * 4, this.var_byte_arr_arr_j[24][this.var_short_arr_arr_b[1][i - 1] & 0xFFF] * 4, this.var_int_v, (this.var_byte_arr_arr_j[3][i] & 0xFF) >> 6, this.aI - 3);
                    }
                    if (this.var_int_w != this.var_int_v) {
                        this.var_int_w = this.var_int_v;
                        this.var_int_y = 0;
                    }
                    this.var_int_z = this.var_int_y;
                    this.var_c_a.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.var_int_y);
                    continue;
                }
                if (this.aI == 0) continue;
                this.d(n4, i);
            }
            this.var_c_a.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N]);
            this.var_boolean_arr_b[by] = false;
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void d(int n, int n2) {
        if (n == 0) {
            this.b(this.aI, this.aJ, this.aK);
            this.aG = this.aJ;
            this.aH = this.aK;
            return;
        }
        if (n == 1) {
            this.j(n2);
            return;
        }
        if (n == 2) {
            if (this.var_boolean_Q && (this.aI == 4 || this.aI == 94) || this.var_boolean_R && (this.aI == 5 || this.aI == 95) || !this.var_boolean_T && this.aI == 1 || !this.var_boolean_U && this.aI == 2) {
                return;
            }
            if (n2 - 1 == 1201) {
                var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].setColor(1105252);
                f.b(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 11 + this.aJ + (this.var_byte_I - this.var_int_W) * 5, 8 + this.aK + (this.var_byte_K - this.var_int_X + this.aL) * 4, this.var_byte_O * 5 - 1, this.var_byte_P * 4 - 1);
                this.d(this.aI, this.aJ + (this.var_byte_y + this.var_byte_I - this.var_int_W) * 5 - 11, this.aK + (this.var_byte_A + this.var_byte_K - this.var_int_X + this.aL) * 4 - 8, this.var_int_f / this.var_int_k);
            } else {
                this.d(this.aI, this.aJ, this.aK, this.var_int_f / this.var_int_k);
            }
            this.var_boolean_S = true;
            return;
        }
        if (n == 3 && this.aI == 11) {
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], 0, 0, this.var_byte_arr_arr_j[23][this.var_short_arr_arr_b[1][1181] & 0xFFF] * 4, this.var_byte_arr_arr_j[24][this.var_short_arr_arr_b[1][1181] & 0xFFF] * 4, 11 + this.aJ, 8 + this.aK, 0);
            return;
        }
        if (n == 3 && this.aI == 10) {
            try {
                this.c(this.var_byte_o);
                var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].drawImage(this.var_javax_microedition_lcdui_Image_arr_arr_a[2][0], (11 + this.aJ) * 1, (8 + this.aK) * 1, 3);
                return;
            }
            catch (Exception exception) {
                return;
            }
        }
        if (n == 3 && this.aI <= 2) {
            this.k(n2);
            return;
        }
        if (n == 3 && this.aI <= 6) {
            if (n2 - 1 == 1128 && (this.var_byte_arr_u[0] == 3 || this.var_byte_arr_u[0] == 1)) {
                this.var_c_a.a(this.aJ, this.aK, (this.var_byte_arr_arr_j[3][n2] & 0xFF) >> 6, 108 + this.var_byte_arr_e[6868 + this.var_byte_arr_arr_k[2][0]], this.aF + (this.var_byte_arr_e[1515 + this.var_byte_arr_arr_k[2][0]] == 0 ? 0 : 1), -1, this.aI - 5);
                return;
            }
            this.var_c_a.a(this.aJ, this.aK, (this.var_byte_arr_arr_j[3][n2] & 0xFF) >> 6, this.aF, this.aI - 5);
            return;
        }
        if (n == 4) {
            if (this.aI != 1) {
                int n3 = this.aI;
                this.bc = 11 + this.aJ + (this.var_byte_arr_arr_j[21][n3] & 0x7F);
                this.bd = 8 + this.aK + this.var_byte_arr_arr_j[22][n3];
                this.be = this.var_byte_arr_arr_j[23][n3];
                this.bf = this.var_byte_arr_arr_j[24][n3];
                f.c(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.bc, this.bd, this.be, this.bf);
                return;
            }
            this.bc = 0;
            this.bd = 0;
            this.be = 528;
            this.bf = 704;
            f.c(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.bc, this.bd, this.be, this.bf);
        }
    }

    private void j(int n) {
        if (n - 1 == 1118) {
            int n2 = this.var_byte_arr_r[this.var_byte_as];
            if (this.var_byte_ad != 6) {
                n2 = n2 == 16 ? this.var_byte_arr_e[8749 + this.var_int_q] : n2 + -6 + 20;
            }
            byte by = this.var_byte_arr_a[this.var_short_arr_a[138] + 468 + n2];
            int n3 = 0;
            for (int i = 0; i < 3; ++i) {
                if (this.var_byte_arr_a[this.var_short_arr_a[138] + (10 + i) * 26 + n2] == 0) continue;
                int n4 = this.aK - this.var_byte_arr_a[this.var_short_arr_a[283] + 2] * (by - 1) / 2 + (this.var_byte_arr_a[this.var_short_arr_a[283] + 2] + 2) * n3;
                ++n3;
                this.a(627 + i, this.aJ - 10 + 3, n4);
                this.var_c_a.a(this.aJ + 19, n4, (this.var_byte_arr_arr_j[3][n] & 0xFF) >> 6, String.valueOf(this.var_byte_arr_a[this.var_short_arr_a[138] + (10 + i) * 26 + n2]), 0);
            }
            return;
        }
        if (n - 1 == 1107) {
            int n5 = this.var_byte_arr_r[this.var_byte_as] + 12;
            int n6 = 0;
            for (int i = 0; i < 3; ++i) {
                if (this.var_byte_arr_a[this.var_short_arr_a[138] + (10 + i) * 26 + n5] == 0) continue;
                int n7 = this.aJ - 34 * (this.var_byte_arr_a[this.var_short_arr_a[138] + 468 + n5] - 1) / 2 + 30 * n6;
                ++n6;
                this.a(627 + i, n7 - 2 - 4, this.aK);
                this.var_c_a.a(n7 + 15, this.aK, (this.var_byte_arr_arr_j[3][n] & 0xFF) >> 6, String.valueOf(this.var_byte_arr_a[this.var_short_arr_a[138] + (10 + i) * 26 + n5]), 0);
            }
            this.var_int_arr_d[8] = 0;
            if (this.var_byte_arr_e[8749 + this.var_int_q] == 6 && this.var_byte_arr_r[this.var_byte_as] != 1) {
                this.var_int_arr_d[8] = -20;
            }
            return;
        }
        switch (n - 1) {
            case 1073: {
                this.aF /= 21;
            }
        }
        this.a(this.aI + this.aF, this.aJ, this.aK);
    }

    private void k(int n) {
        switch (n - 1) {
            case 1043: 
            case 1047: 
            case 1051: 
            case 1059: 
            case 1063: {
                if (this.aF >= 0 && this.var_byte_arr_a[this.var_short_arr_a[126] + this.aF] != -1) {
                    this.aF = this.var_byte_arr_e[this.var_short_arr_b[this.var_byte_arr_a[this.var_short_arr_a[126] + this.aF]] + this.var_byte_l] + this.var_byte_arr_a[this.var_short_arr_a[127] + this.aF];
                    break;
                }
                return;
            }
            case 1067: {
                if (this.aF != 0 && this.var_byte_arr_e[3535 + this.var_byte_l] != 0 && this.var_byte_arr_e[3535 + this.var_byte_l] != 15) break;
                return;
            }
            case 1055: {
                this.aF = (9 - this.aF) * 2 + 1;
            }
        }
        switch (n - 1) {
            case 1015: {
                this.var_c_a.a(this.aJ, this.aK, (this.var_byte_arr_arr_j[3][n] & 0xFF) >> 6, String.valueOf(this.aF) + "/" + this.var_short_arr_arr_a[0][16], this.aI - 1);
                return;
            }
        }
        this.var_c_a.a(this.aJ, this.aK, (this.var_byte_arr_arr_j[3][n] & 0xFF) >> 6, String.valueOf(this.aF), this.aI - 1);
    }

    private boolean boolean_c() {
        block8: {
            block20: {
                block19: {
                    block18: {
                        block17: {
                            block16: {
                                block15: {
                                    block14: {
                                        block13: {
                                            block12: {
                                                block11: {
                                                    block10: {
                                                        block9: {
                                                            block7: {
                                                                this.var_boolean_G = false;
                                                                if (this.aD != 0) break block7;
                                                                for (int i = 0; i < 5; ++i) {
                                                                    if (this.var_short_arr_arr_a[0][this.var_byte_arr_a[this.var_short_arr_a[146] + i]] == this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 0] + i]) continue;
                                                                    this.var_boolean_G = true;
                                                                    this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 0] + i] = this.var_short_arr_arr_a[0][this.var_byte_arr_a[this.var_short_arr_a[146] + i]];
                                                                    this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 0] + i] = 1;
                                                                }
                                                                break block8;
                                                            }
                                                            if (this.aD != 1 && this.aD != 9) break block9;
                                                            this.x();
                                                            break block8;
                                                        }
                                                        if (this.aD != 2 && this.aD != 5) break block10;
                                                        this.z();
                                                        break block8;
                                                    }
                                                    if (this.aD != 4) break block11;
                                                    this.y();
                                                    break block8;
                                                }
                                                if (this.aD != 6) break block12;
                                                this.A();
                                                break block8;
                                            }
                                            if (this.aD != 7 && this.aD != 8) break block13;
                                            if (this.var_short_arr_d[46] == this.var_byte_arr_r[this.var_byte_as] && !this.var_boolean_arr_b[this.aD]) break block8;
                                            this.var_short_arr_d[46] = this.var_byte_arr_r[this.var_byte_as];
                                            this.var_boolean_G = true;
                                            if (this.var_byte_arr_r[this.var_byte_as] < 10) {
                                                this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD]] = this.var_byte_arr_r[this.var_byte_as];
                                                this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD] + 1] = this.var_byte_arr_a[this.var_short_arr_a[138] + 338 + this.var_byte_arr_r[this.var_byte_as] + 12];
                                                this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD] + 2] = this.var_byte_arr_a[this.var_short_arr_a[138] + 364 + this.var_byte_arr_r[this.var_byte_as] + 12];
                                            }
                                            break block8;
                                        }
                                        if (this.aD != 10) break block14;
                                        if (this.var_byte_Q != 16 || this.var_int_z == this.var_int_y) break block8;
                                        this.var_byte_arr_k[53] = 1;
                                        break block8;
                                    }
                                    if (this.aD != 15) break block15;
                                    this.var_short_arr_d[73] = (short)(98 + this.var_byte_m);
                                    if (this.var_int_z == this.var_int_y) break block8;
                                    this.var_byte_arr_k[72] = 1;
                                    this.var_boolean_G = true;
                                    break block8;
                                }
                                if (this.aD != 12) break block16;
                                if (this.var_byte_am >= 51 && this.var_byte_q <= 2) {
                                    this.var_byte_am = (byte)51;
                                }
                                short s = (short)(this.var_short_arr_d[57] = (short)(this.var_short_arr_arr_a[0][17] == this.var_byte_am ? 104 : (short)(108 + this.var_byte_arr_e[6868 + this.var_byte_am])));
                                if (this.var_byte_Q == 17 && this.var_byte_al == 3 && (this.var_byte_ai == 35 || this.var_byte_ai == 50 || this.var_byte_ai == 54)) {
                                    this.var_short_arr_d[57] = 105;
                                }
                                this.var_short_arr_d[58] = this.var_byte_arr_e[2727 + this.var_byte_am];
                                if (this.var_int_z == this.var_int_y) break block8;
                                this.var_byte_arr_k[56] = 1;
                                this.var_boolean_G = true;
                                break block8;
                            }
                            if (this.aD != 13) break block17;
                            this.var_short_arr_d[62] = (short)(82 + (this.var_byte_q == 7 ? 21 : this.var_byte_arr_a[this.var_short_arr_a[248] + this.var_byte_q]));
                            this.var_short_arr_d[63] = this.var_byte_ak;
                            if (this.var_int_z == this.var_int_y) break block8;
                            this.var_byte_arr_k[61] = 1;
                            this.var_boolean_G = true;
                            break block8;
                        }
                        if (this.aD != 14) break block18;
                        this.var_boolean_T = this.var_int_W != 0;
                        this.var_boolean_U = this.var_int_W + var_byte_ag < this.var_short_c;
                        this.var_boolean_Q = this.var_int_X == 0;
                        boolean bl = this.var_boolean_R = this.var_int_X + var_byte_ah >= this.var_short_d;
                        if (this.var_short_arr_d[66] != this.var_int_W || this.var_short_arr_d[71] != this.var_int_X) {
                            this.var_short_arr_d[66] = (short)this.var_int_W;
                            this.var_short_arr_d[71] = (short)this.var_int_X;
                            this.D();
                        }
                        this.var_byte_arr_k[66] = 1;
                        this.var_int_ag = 0;
                        this.var_int_af = 0;
                        break block8;
                    }
                    if (this.aD != 17) break block19;
                    this.B();
                    break block8;
                }
                if (this.aD != 16) break block20;
                if (this.var_int_z == this.var_int_y) break block8;
                this.var_byte_arr_k[76] = 1;
                this.var_boolean_G = true;
                break block8;
            }
            if (this.aD == 18 || this.aD == 19) {
                for (int i = 0; i < this.var_byte_arr_a[this.var_short_arr_a[307] + this.var_byte_m]; ++i) {
                    this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD] + i] = i == this.var_int_Z ? (byte)1 : 0;
                }
            }
        }
        return this.var_boolean_G;
    }

    private void x() {
        int n;
        this.var_byte_arr_k[47] = this.var_byte_ay;
        for (n = 0; n < 2; ++n) {
            this.var_byte_arr_k[48 + n] = this.var_byte_F == 2 + n ? 2 : (this.var_byte_arr_arr_a[2 + n][0] > 0 ? 1 : 0);
        }
        this.var_byte_arr_k[50] = (byte)(41 + this.var_byte_arr_u[0]);
        this.var_byte_arr_k[51] = this.var_byte_arr_a[this.var_short_arr_a[304] + this.var_byte_arr_u[0]];
        for (n = this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 9]; n < this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 9] + 5; ++n) {
            if (this.var_byte_arr_k[n] == -1) continue;
            if (this.var_short_arr_d[n] != this.var_byte_arr_k[n]) {
                this.var_short_arr_d[n] = this.var_byte_arr_k[n];
                this.var_byte_arr_k[n] = 1;
                this.var_boolean_G = true;
                continue;
            }
            this.var_byte_arr_k[n] = 0;
        }
    }

    private void y() {
        for (int i = 0; i < 23; ++i) {
            if (this.var_byte_arr_e[this.var_short_arr_b[this.var_byte_arr_a[this.var_short_arr_a[147] + i]] + this.var_byte_l] == this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 4] + i]) continue;
            this.var_boolean_G = true;
            this.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 4] + i] = this.var_byte_arr_e[this.var_short_arr_b[this.var_byte_arr_a[this.var_short_arr_a[147] + i]] + this.var_byte_l];
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 4] + i] = 1;
        }
        if (this.var_byte_arr_k[11] == 1 || this.var_byte_arr_k[12] == 1) {
            this.var_byte_arr_k[12] = 1;
            this.var_byte_arr_k[11] = 1;
        }
        if (this.var_byte_arr_e[3636 + this.var_byte_l] == 0) {
            this.var_short_arr_d[29] = 0;
        }
        this.var_short_arr_d[14] = (short)(108 + this.var_byte_arr_e[6868 + this.var_byte_l]);
    }

    private void z() {
        if (this.var_short_arr_d[4] > 0) {
            this.var_int_v = this.var_short_arr_d[4];
            this.var_byte_arr_k[3] = -1;
            this.var_byte_arr_k[5] = -1;
            this.var_boolean_G = true;
            return;
        }
        if (this.var_short_arr_d[5] != this.var_byte_arr_r[this.var_byte_as] || this.var_boolean_arr_b[this.aD]) {
            this.var_short_arr_d[5] = this.var_byte_arr_r[this.var_byte_as];
            this.var_byte_arr_k[3] = 1;
            this.var_byte_arr_k[5] = 1;
            this.var_short_arr_d[3] = this.var_byte_arr_r[this.var_byte_as] >= 10 ? (short)(21 + this.var_byte_arr_r[this.var_byte_as] - 10) : (this.var_byte_arr_r[this.var_byte_as] >= 0 ? (short)(12 + this.var_byte_arr_r[this.var_byte_as]) : (this.var_boolean_K ? (short)41 : (this.var_boolean_F || !this.var_boolean_V ? (short)(108 + this.var_byte_arr_e[6868 + -this.var_byte_arr_r[this.var_byte_as]]) : (short)29)));
            this.var_byte_arr_k[4] = -1;
            this.var_boolean_G = true;
        }
    }

    private void A() {
        if (this.var_short_arr_d[36] != this.var_byte_arr_r[this.var_byte_as] || this.var_boolean_arr_b[this.aD]) {
            this.var_int_v = 0 + this.var_byte_arr_r[this.var_byte_as];
            this.var_short_arr_d[36] = this.var_byte_arr_r[this.var_byte_as];
            this.var_byte_arr_k[34] = 1;
            this.var_byte_arr_k[38] = 1;
            this.var_byte_arr_k[36] = 1;
            this.var_byte_arr_k[37] = 1;
            this.var_byte_arr_k[35] = 1;
            this.var_boolean_G = true;
        }
        if (this.var_int_z != this.var_int_y) {
            this.var_byte_arr_k[38] = 1;
            this.var_boolean_G = true;
        }
        this.var_short_arr_d[34] = (short)(0 + this.var_byte_arr_r[this.var_byte_as]);
    }

    private void B() {
        if (this.var_byte_v == 1) {
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD]] = this.var_byte_w == 3 || this.var_int_Y == 4 || this.var_int_q > 0 && this.var_byte_arr_e[8749 + this.var_int_q] == 0 && this.var_byte_arr_r[this.var_byte_as] >= 0 && this.var_byte_arr_r[this.var_byte_as] <= 5 ? 2 : (this.var_byte_w != 4 && this.var_byte_w != 2 ? 1 : 0);
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD] + 1] = this.var_boolean_K ? 2 : (this.var_byte_w == 1 || this.var_byte_F != -1 || this.var_byte_ad != 1 && this.var_byte_ad != 9 ? 0 : 1);
        } else if (this.var_byte_Q == 32) {
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD]] = 2;
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD] + 1] = 3;
        } else {
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD]] = this.var_byte_arr_a[this.var_short_arr_a[153] + 116 + this.var_byte_Q];
            this.var_byte_arr_k[this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + this.aD] + 1] = this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + this.var_byte_Q];
        }
        for (int i = this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 17]; i < this.var_byte_arr_a[this.var_short_arr_a[195] + 60 + 17] + 2; ++i) {
            if (this.var_short_arr_d[i] != this.var_byte_arr_k[i]) {
                this.var_short_arr_d[i] = this.var_byte_arr_k[i];
                this.var_byte_arr_k[i] = 1;
                this.var_boolean_G = true;
                continue;
            }
            this.var_byte_arr_k[i] = 0;
        }
    }

    private void a(int n, byte by, int n2) {
        int n3 = 0;
        for (n3 = 0; n3 < this.aW; ++n3) {
            int n4;
            int n5;
            int n6;
            int n7;
            f f2;
            this.var_int_N = n;
            int n8 = aV * n3;
            int n9 = 1;
            if (this.aX + n3 == this.var_byte_as) {
                n9 = 0;
            } else if (by == 2) continue;
            this.b(this.var_short_arr_arr_b[1][n] & 0xFFF, this.aY + n8, n2 - 1);
            this.a(548 + n9, this.aY + n8, n2);
            int n10 = this.var_byte_arr_r[this.aX + n3];
            if (n10 < 0) {
                this.a(-n10, this.aY + n8 - -1, n2 + 8 + 2 + 3, -8, (byte)29);
                if (!this.var_boolean_V || this.var_boolean_F || this.aX + n3 != this.var_byte_as) continue;
                f2 = this;
                n7 = 18;
                n6 = this.aY + n8;
                n5 = n2;
                n4 = this.var_int_f;
            } else {
                if (n10 <= 8) {
                    this.a(659 + n10, this.aY + n8, n2);
                    int n11 = 0;
                    int n12 = 0;
                    if (this.var_byte_arr_e[8749 + this.var_int_q] == 6) {
                        n11 = -1;
                        n12 = 6;
                    }
                    this.var_c_a.a(this.aY + n8 + 19 + n11 + 6, n2 + 5 + n12 + 2, 1, String.valueOf(this.var_byte_arr_s[n3 + this.aX]), 0);
                    if (this.var_byte_arr_e[8749 + this.var_int_q] == 6 || this.aX + n3 >= this.var_byte_av || this.aX + n3 != this.var_byte_as) continue;
                    this.d(3, this.aY + n8 + 6, n2 + 2 + 2, this.var_int_f);
                    this.var_boolean_S = true;
                    continue;
                }
                f2 = this;
                n7 = n10;
                n6 = this.aY + n8;
                n5 = n2;
                n4 = this.aX + n3 == this.var_byte_as ? this.var_int_f : 0;
            }
            f2.d(n7, n6, n5, n4);
        }
        if (this.var_boolean_T) {
            this.d(1, this.aY - 9, n2 + 8, this.var_int_e);
        }
        if (this.var_boolean_U) {
            this.d(2, this.aY + this.aZ - 9 + 9, n2 + 8, this.var_int_e);
        }
    }

    private void c(int n, int n2, int n3) {
        int n4 = this.var_byte_arr_a[this.var_short_arr_a[283] + 2] + 6;
        int n5 = 0;
        this.var_int_ab = this.var_byte_arr_a[this.var_short_arr_a[152] + this.var_byte_Q + 1] - this.var_byte_arr_a[this.var_short_arr_a[152] + this.var_byte_Q];
        int n6 = n2 + this.var_byte_arr_arr_j[23][this.var_short_arr_arr_b[1][n] & 0xFFF] / 2 * 4;
        int n7 = n3 - this.var_int_ab * n4 / 2 + n4 / 2;
        for (int i = 0; i < this.var_int_ab; ++i) {
            if (i == this.var_int_Z) {
                n5 = n7;
            }
            this.b(this.var_short_arr_arr_b[1][n] & 0xFFF, n2, n7);
            this.var_c_a.a(n6, n7, 1, 57 + this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + this.var_byte_Q] + i], 0);
            n7 += n4;
        }
        this.var_c_a.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N]);
        this.d(2, n6 - 50 - 20, n5 + 4, this.var_int_e);
        this.d(1, n6 + 49 + 20, n5 + 4, this.var_int_e);
    }

    final void void_a(int n) {
        if ((var_byte_af = (byte)(var_byte_af + n)) > 98) {
            var_byte_af = (byte)98;
        }
        this.var_byte_arr_n[3] = this.var_byte_arr_n[4] = var_byte_af;
        this.var_byte_arr_n[2] = this.var_byte_arr_n[4];
        for (int i = 0; i < 5; ++i) {
            var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].setColor(this.var_int_arr_f[i]);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 70 + this.var_byte_arr_l[i], 312 + this.var_byte_arr_m[i], this.var_byte_arr_n[i], this.var_byte_arr_o[i]);
        }
        if (!this.var_boolean_y) {
            this.var_tribes_a.var_d_a.a();
            Thread.yield();
            return;
        }
        this.l();
    }

    private void c(byte by) {
        byte by2 = 0;
        try {
            byte by3;
            System.gc();
            Thread.yield();
            DataInputStream dataInputStream = new DataInputStream(this.getClass().getResourceAsStream("/pi8"));
            for (by2 = 0; by2 < 12 && (by3 = (byte)(dataInputStream.readByte() & 0xFF)) != 255; by2 = (byte)(by2 + 1)) {
                short s = (short)(by3 << 8 | dataInputStream.readByte() & 0xFF);
                byte[] byArray = new byte[s];
                dataInputStream.read(byArray, 0, s);
                if (by2 != by) continue;
                this.var_javax_microedition_lcdui_Image_arr_arr_a[2][0] = Image.createImage((byte[])byArray, (int)0, (int)s);
                break;
            }
            dataInputStream.close();
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void C() {
        this.aM = this.var_short_c > var_byte_ag ? var_byte_ag : this.var_short_c;
        this.aN = this.var_short_d > var_byte_ah ? var_byte_ah : this.var_short_d;
        this.var_byte_N = 1;
        this.b(this.var_short_arr_arr_b[1][1181] & 0xFFF, -11, -8);
        int n = 0;
        int n2 = 0;
        boolean bl = false;
        for (int i = 0; i < this.aN; ++i) {
            int n3 = 0;
            int n4 = -1;
            for (int j = 0; j <= this.aM; ++j) {
                if (j == this.aM) {
                    bl = true;
                } else {
                    this.e(this.var_int_W + j, this.var_int_X + i);
                }
                if (!bl && this.aO == n4) {
                    ++n2;
                    continue;
                }
                if (n2 > 0) {
                    var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(n4);
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n3 * 5 - 11, (this.aL + n) * 4 - 8, n2 * 5, 4);
                    n2 = 0;
                }
                if (bl) {
                    bl = false;
                    continue;
                }
                n4 = this.aO;
                n3 = j;
                n = i;
                n2 = 1;
            }
        }
    }

    private void D() {
        block3: {
            int n;
            int n2;
            block2: {
                this.var_byte_N = var_byte_M;
                int n3 = (this.var_short_arr_arr_b[1][1181] >> 12 & 3) << 7;
                this.b(this.var_short_arr_arr_b[1][1181] & 0xFFF, 120 + this.var_byte_arr_arr_j[1][1181] + 11, 160 + this.var_byte_arr_arr_j[2][1181] + 8 + n3);
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], (this.var_int_af + 1) / 2 * 5, (this.var_int_ag + 1) / 2 * 4, this.var_byte_arr_arr_j[23][this.var_short_arr_arr_b[1][1181] & 0xFFF] * 5 - 5 * this.var_byte_arr_a[this.var_short_arr_a[148] + this.var_int_af + 1] - 44, this.var_byte_arr_arr_j[24][this.var_short_arr_arr_b[1][1181] & 0xFFF] * 5 - 4 * this.var_byte_arr_a[this.var_short_arr_a[148] + this.var_int_ag + 1] - 32, 131 + this.var_byte_arr_arr_j[1][1181] + (-this.var_int_af + 1) / 2 * 5, 168 + this.var_byte_arr_arr_j[2][1181] + (-this.var_int_ag + 1) / 2 * 4 + n3, 0);
                var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[1]].drawImage(var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[0]], -(120 + this.var_byte_arr_arr_j[1][1181] + 11) * 1, -(160 + this.var_byte_arr_arr_j[2][1181] + 8 + n3) * 1, 0);
                n2 = (this.var_int_af + 1 >> 1) * (this.aM - 1);
                n = (this.var_int_ag + 1 >> 1) * (this.aN - 1);
                this.var_byte_N = 1;
                if (this.var_int_ag != 0) break block2;
                var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(0xAA9944);
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 * 5 - 11, n - 8, 5, var_byte_ah * 4);
                for (n = 0; n < this.aN; ++n) {
                    this.e(this.var_int_W + n2, this.var_int_X + n);
                    var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(this.aO);
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 * 5 - 11, (this.aL + n) * 4 - 8, 5, 4);
                }
                break block3;
            }
            if (this.var_int_af != 0) break block3;
            for (n2 = 0; n2 < this.aM; ++n2) {
                this.e(this.var_int_W + n2, this.var_int_X + n);
                var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(this.aO);
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], n2 * 5 - 11, (this.aL + n) * 4 - 8, 5, 4);
            }
        }
    }

    private void e(int n, int n2) {
        this.aO = -1;
        byte by = this.byte_a(n, n2);
        if (by != 2) {
            if (this.var_byte_arr_arr_c[n2][n] > 0) {
                this.aO = f.byte_a(this.var_byte_arr_arr_c[n2][n]) == 1 && (this.var_byte_arr_e[7979 + this.var_byte_arr_arr_c[n2][n]] & 2) != 0 ? -1 : this.var_int_arr_arr_b[by][f.byte_a(this.var_byte_arr_arr_c[n2][n]) + 6];
            } else if (this.var_byte_arr_arr_c[n2][n] < 0) {
                this.aO = this.var_int_arr_arr_b[by][f.byte_b(this.var_byte_arr_arr_c[n2][n]) + 9];
            }
            if (this.aO == -1) {
                this.aO = this.var_int_arr_arr_b[by][this.var_byte_arr_a[this.var_short_arr_a[194] + (this.var_byte_arr_arr_b[n2][n] & 0xFF)]];
                return;
            }
        } else {
            this.aO = 6049325;
        }
    }

    private void E() {
        this.var_int_W = this.var_byte_I - var_byte_ag / 2 + (this.var_byte_O >> 1);
        int n = this.var_int_W < 0 ? 0 : (this.var_int_W = this.var_int_W + var_byte_ag >= this.var_short_c ? this.var_short_c - var_byte_ag : this.var_int_W);
        if (var_byte_ah > this.var_short_d) {
            this.aL = var_byte_ah - this.var_short_d >> 1;
            return;
        }
        this.var_int_X = this.var_byte_K - var_byte_ah / 2 + (this.var_byte_P >> 1);
        this.var_int_X = this.var_int_X < 0 ? 0 : (this.var_int_X + var_byte_ah >= this.var_short_d ? this.var_short_d - var_byte_ah : this.var_int_X);
    }

    private void F() {
        if (this.var_int_c == -1 && this.var_byte_arr_a[this.var_short_arr_a[153] + 0 + this.var_byte_Q] == 1) {
            this.G();
        } else if (this.var_byte_arr_a[this.var_short_arr_a[153] + 0 + this.var_byte_Q] == 1) {
            this.H();
        } else if (this.var_byte_Q == 23) {
            this.I();
        } else if (this.var_byte_Q == 15) {
            this.J();
        } else if (this.var_byte_Q == 17) {
            this.P();
        } else if (this.var_byte_Q == 20) {
            this.K();
        } else if (this.var_byte_Q == 18) {
            if (this.var_boolean_H) {
                this.var_boolean_H = false;
                this.var_boolean_arr_b[13] = true;
                this.var_boolean_arr_b[11] = true;
                this.a((byte)11, 0, 0);
                this.a((byte)17, 0, 320);
            }
            this.a((byte)13, 0, 0);
        } else if (this.var_byte_Q == 19) {
            this.L();
        } else if (this.var_byte_Q == 24) {
            if (this.var_boolean_H) {
                this.var_boolean_H = false;
                this.var_boolean_arr_b[16] = true;
                this.var_boolean_arr_b[11] = true;
                this.a((byte)11, 0, 0);
                this.a((byte)16, 0, 0);
                this.a((byte)17, 0, 320);
            }
        } else if (this.var_byte_Q == 25) {
            this.M();
        } else if (this.var_byte_Q == 27) {
            this.N();
        } else if (this.var_byte_Q == 32 && this.var_boolean_H) {
            this.var_boolean_H = false;
            try {
                var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].drawImage(Image.createImage((String)"/l3"), 11, 8, 20);
            }
            catch (Exception exception) {}
            this.var_boolean_arr_b[17] = true;
            this.a((byte)17, 0, 320);
        }
        this.var_byte_N = this.var_byte_arr_c[1];
    }

    private void G() {
        if (this.var_boolean_H) {
            this.var_boolean_H = false;
            this.var_byte_N = this.var_byte_arr_c[1];
            var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(9422847);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], 0, -8, this.var_int_arr_a[this.var_byte_N], this.var_int_arr_b[this.var_byte_N]);
            var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(940839);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], 0, -8 + this.var_int_arr_b[this.var_byte_N] - 64, this.var_int_arr_a[this.var_byte_N], 64);
            this.var_int_S = 0;
            this.var_int_T = 248;
            this.void_a(1118, (byte)2);
            if (this.var_byte_Q == this.var_byte_U || this.var_byte_Q == 3 || this.var_byte_Q == 12 || this.var_byte_Q == 13 || this.var_byte_Q == 2 || this.var_byte_Q == this.var_byte_V || this.var_byte_Q == 9 || this.var_byte_Q == 14) {
                this.var_byte_arr_k[53] = -1;
                this.var_byte_arr_k[54] = 1;
            } else if (this.var_byte_Q == 16 || this.var_byte_Q == 21 || this.var_byte_Q == 22) {
                this.var_byte_arr_k[53] = 1;
                this.var_byte_arr_k[54] = -1;
            }
            this.var_byte_arr_k[52] = -1;
        }
        this.var_byte_N = var_byte_M;
        var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].drawImage(var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], 0, 328, 36);
        var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N].setColor(9422847);
        f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], 0, 0, this.var_int_arr_a[this.var_byte_N], 80);
        for (int i = 0; i < 4; ++i) {
            if (this.var_int_arr_arr_a[0][i] > 240 || this.var_int_arr_arr_a[0][3] == -1000) {
                this.var_int_arr_arr_a[0][i] = -88 - this.int_a(65535, 60);
                this.var_int_arr_arr_a[1][i] = this.int_a(65535, 48);
                this.var_int_arr_arr_a[2][i] = this.int_a(255, 4);
            }
            int[] nArray = this.var_int_arr_arr_a[0];
            int n = i;
            int n2 = nArray[n] + (this.var_int_arr_arr_a[2][i] + 2 >> 1);
            nArray[n] = n2;
            int[] nArray2 = this.var_int_arr_arr_a[1];
            int n3 = i;
            int n4 = nArray2[n3] + (this.int_a(255, 5) == 0 ? this.int_a(255, 3) - 1 : 0);
            nArray2[n3] = n4;
            this.a(1667 + this.var_int_arr_arr_a[2][i], n2, n4);
        }
        if (this.var_byte_Q == this.var_byte_U || this.var_byte_Q == 12 || this.var_byte_Q == 13 || this.var_byte_Q == 2 || this.var_byte_Q == this.var_byte_V || this.var_byte_Q == 9 || this.var_byte_Q == 14) {
            this.var_byte_arr_k[53] = -1;
            this.var_byte_arr_k[54] = 1;
        } else if (this.var_byte_Q == 16 || this.var_byte_Q == 21 || this.var_byte_Q == 22) {
            this.var_byte_arr_k[53] = 1;
            this.var_byte_arr_k[54] = -1;
        }
        this.var_byte_arr_k[52] = -1;
        this.var_boolean_arr_b[10] = true;
        this.a(1665, 120, 0);
        this.var_int_S = 0;
        this.var_int_T = 272;
        this.void_a(1118, (byte)1);
        this.a((byte)10, 25, 64);
        this.var_boolean_arr_b[17] = true;
        this.a((byte)17, 0, 320);
    }

    private void H() {
        if (this.var_boolean_H) {
            this.var_boolean_H = false;
            this.O();
            if (this.var_byte_Q == 10 || this.var_byte_Q == 11 || this.var_byte_Q == 12 || this.var_byte_Q == 13) {
                this.var_byte_arr_k[53] = -1;
                this.var_byte_arr_k[54] = 1;
            } else if (this.var_byte_Q == 16 || this.var_byte_Q == 21 || this.var_byte_Q == 22) {
                this.var_byte_arr_k[53] = 1;
                this.var_byte_arr_k[54] = -1;
            }
            this.var_byte_arr_k[52] = -1;
            this.var_boolean_arr_b[10] = true;
        }
        this.a((byte)10, 25, 64);
        this.a((byte)17, 0, 320);
    }

    private void I() {
        if (this.var_boolean_H) {
            this.var_boolean_H = false;
            this.var_boolean_arr_b[11] = true;
            this.var_int_v = 69;
            this.var_byte_arr_k[55] = 1;
            this.a((byte)11, 0, 0);
            this.var_byte_arr_k[55] = -1;
        }
    }

    private void J() {
        if (this.var_boolean_H) {
            this.var_boolean_H = false;
            this.var_boolean_arr_b[15] = true;
            this.var_boolean_arr_b[11] = true;
            this.a((byte)11, 0, 0);
            this.a((byte)17, 0, 320);
        }
        this.a((byte)15, 0, 0);
    }

    private void K() {
        if (this.var_boolean_H) {
            this.var_boolean_H = false;
            this.var_boolean_A = true;
            this.n();
            this.u();
            this.O();
            this.var_boolean_arr_b[12] = true;
        }
        this.a((byte)12, 0, 0);
        this.a((byte)17, 0, 320);
    }

    private void L() {
        if (this.var_boolean_H) {
            this.var_boolean_H = false;
            this.var_boolean_arr_b[11] = true;
            this.a((byte)11, 0, 0);
            this.var_boolean_arr_b[14] = true;
            this.C();
        }
        this.a((byte)14, 120, 160);
        this.var_boolean_arr_b[17] = true;
        this.a((byte)17, 0, 320);
    }

    private void M() {
        this.var_boolean_H = false;
        if (!this.var_boolean_I) {
            this.O();
            var_javax_microedition_lcdui_Graphics_arr_a[1].drawImage(var_javax_microedition_lcdui_Image_arr_a[0], 0, 0, 0);
        }
        this.var_boolean_arr_b[2] = true;
        f.a(var_javax_microedition_lcdui_Graphics_arr_a[0], var_javax_microedition_lcdui_Image_arr_a[1], 0, 0, 264, 301, 0, 0, 0);
        this.a((byte)(18 + this.var_byte_m), 0, 0);
        this.a((byte)2, 0, this.var_int_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + 2]]);
        this.a((byte)17, 0, 320);
        this.var_boolean_I = true;
    }

    private void N() {
        if (this.var_boolean_ab) {
            this.var_boolean_ab = false;
            this.var_int_x = this.var_int_v;
            this.var_int_v = 61;
            this.var_boolean_arr_b[11] = true;
            this.var_byte_arr_k[55] = 1;
            this.a((byte)11, 0, 0);
            this.var_byte_arr_k[55] = -1;
            this.a((byte)17, 0, 320);
        }
    }

    private void O() {
        this.var_byte_arr_c[8] = 0;
        this.var_byte_arr_c[9] = 0;
        f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[0]], var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], 0, 0, 264, this.var_int_A, 0, this.bb - this.var_byte_ax, 0);
        for (byte by = 0; by < 20; by = (byte)((byte)(by + 1))) {
            if (!this.var_boolean_arr_a[by]) continue;
            this.var_boolean_arr_b[by] = true;
            this.a(by, 0, this.var_int_arr_d[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + by]]);
            this.var_byte_N = this.var_byte_arr_c[0];
            if (this.var_byte_arr_a[this.var_short_arr_a[195] + 20 + by] == 1 && this.var_byte_Q != 20) {
                this.a(524, 0, 0 + this.bb);
                continue;
            }
            if (this.var_byte_arr_a[this.var_short_arr_a[195] + 20 + by] != 2) continue;
            this.a(528, 0, 320 - this.ba);
        }
        this.var_byte_arr_c[8] = 2;
        this.var_byte_arr_c[9] = 2;
    }

    private void P() {
        if (this.aP > 0 && !this.var_boolean_J) {
            this.aP += 4;
            var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].setColor(0);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 0, 240, 16 + this.aP);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 336 - this.aP, 240, this.aP);
            this.var_boolean_c = true;
            if (this.aP - 4 > 160) {
                this.aP = -this.aP;
                this.var_boolean_c = false;
                this.i();
            } else {
                return;
            }
        }
        if (this.var_boolean_H && !this.var_boolean_J) {
            this.var_boolean_arr_b[12] = true;
            var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].setColor(0);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 0, 240, 112);
            f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 240, 240, 96);
        }
        if (this.var_byte_arr_a[this.var_short_arr_a[155] + 0 + this.aS] == 1) {
            if (this.aR >= 0) {
                if (this.aR < this.var_byte_arr_a[this.var_short_arr_a[155] + 84 + this.aS] || this.var_byte_am != 0) {
                    this.var_byte_N = 0;
                    var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].setColor(0);
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 112, 240, 128);
                    this.d(98 + this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS], 120, 176, this.var_byte_am == 0 ? this.aR : this.var_int_f);
                    this.d(104, 120, 176, this.var_int_f);
                    this.aR = this.var_byte_am == 0 ? this.aR + 1 : this.aR;
                } else if (this.var_byte_am == 0 && this.aS != 0) {
                    this.aR = -1;
                    this.var_boolean_j = true;
                    return;
                }
            }
        } else if (this.var_byte_arr_a[this.var_short_arr_a[155] + 0 + this.aS] >= 2 || this.var_byte_arr_a[this.var_short_arr_a[155] + 0 + this.var_byte_ao] >= 2) {
            this.Q();
            this.R();
        }
        this.var_boolean_H = false;
        if (this.aP < 0) {
            this.aP += 4;
            this.var_boolean_c = true;
            if (this.aP >= -48) {
                this.aP = 0;
                this.var_boolean_c = false;
                this.i();
            }
        }
        if (this.aP == 0 && this.var_byte_al != 0) {
            this.a((byte)12, 0, 0);
            this.a((byte)17, 0, 320);
        }
    }

    private void Q() {
        if (this.aS > 0 && this.aR >= 0 && (this.aP == 0 || this.var_boolean_H)) {
            if (this.aR == 0 && this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS] > 0) {
                for (int i = 0; i < this.var_byte_arr_p.length; ++i) {
                    int n;
                    if (this.var_byte_arr_p[i] == 0) continue;
                    int n2 = n = i > 6 ? 6 : i;
                    if (this.var_byte_arr_a[this.var_short_arr_a[196] + n * 33 + 0 + this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS] * 3] != 0) {
                        this.var_byte_arr_e[2929 + this.var_byte_arr_p[i]] = this.var_byte_arr_a[this.var_short_arr_a[196] + n * 33 + 0 + this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS] * 3];
                        this.var_byte_arr_e[1313 + this.var_byte_arr_p[i]] = this.var_byte_arr_a[this.var_short_arr_a[196] + n * 33 + 2 + this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS] * 3];
                        this.var_byte_arr_e[2828 + this.var_byte_arr_p[i]] = 105;
                    }
                    if (this.var_byte_arr_a[this.var_short_arr_a[196] + n * 33 + 1 + this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS] * 3] != 0) {
                        this.var_byte_arr_e[606 + this.var_byte_arr_p[i]] = (byte)(-10 + this.var_byte_arr_a[this.var_short_arr_a[196] + n * 33 + 1 + this.var_byte_arr_a[this.var_short_arr_a[155] + 28 + this.aS] * 3]);
                        this.var_byte_arr_e[808 + this.var_byte_arr_p[i]] = 0;
                    }
                    this.var_byte_arr_e[3030 + this.var_byte_arr_p[i]] = 0;
                }
            }
            if (this.aR >= this.var_byte_arr_a[this.var_short_arr_a[155] + 84 + this.aS]) {
                this.aR = -2;
                if (this.var_byte_al == 0) {
                    this.var_boolean_j = true;
                    return;
                }
            }
            ++this.aR;
            if (this.aR > 0) {
                this.j();
            }
        }
    }

    private void R() {
        if (this.var_byte_an != 0 || this.var_byte_arr_a[this.var_short_arr_a[155] + 84 + this.var_byte_ao] >= -1 || this.aR > 0) {
            if (this.var_boolean_H) {
                this.var_boolean_A = true;
                this.var_byte_N = 1;
                this.n();
            }
            if (this.var_boolean_J) {
                if (this.var_boolean_H) {
                    this.var_boolean_H = false;
                    this.var_boolean_A = true;
                    this.n();
                    this.u();
                    this.O();
                    this.var_boolean_arr_b[12] = true;
                    return;
                }
            } else if (this.aP == 0 || this.var_boolean_H) {
                this.aQ = 0;
                if (this.aS == 24) {
                    this.aQ = this.int_a(255, 8);
                }
                f.a(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_arr_c[0]], var_javax_microedition_lcdui_Image_arr_a[this.var_byte_arr_c[1]], 0, 120, 264, 128 - this.aQ, 0, 120 + this.aQ, 0);
                if (this.aS == 24) {
                    var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M].setColor(0);
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 96, 240, 16);
                    f.a(var_javax_microedition_lcdui_Graphics_arr_a[var_byte_M], 0, 240, 240, 16);
                }
                this.var_byte_N = 0;
                this.bc = 0;
                this.bd = 120;
                this.be = 264;
                this.bf = 128;
                f.c(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.bc, this.bd, this.be, this.bf);
                this.u();
                this.bc = 0;
                this.bd = 0;
                this.be = 528;
                this.bf = 704;
                f.c(var_javax_microedition_lcdui_Graphics_arr_a[this.var_byte_N], this.bc, this.bd, this.be, this.bf);
            }
        }
    }

    final void void_b(int n) {
        this.i();
        if (n >= 0) {
            this.var_byte_ai = (byte)n;
            this.S();
            this.T();
        } else {
            if (this.var_byte_ak == this.var_byte_aj - 1) {
                this.U();
                return;
            }
            this.var_byte_ak = (byte)(this.var_byte_ak + 1);
        }
        this.var_int_o = 0;
        this.var_int_v = 71 + this.var_byte_ak;
        this.var_byte_o = (byte)(this.var_byte_arr_a[this.var_short_arr_a[154] + this.var_byte_q] + this.var_byte_ak);
        this.aS = this.var_byte_arr_a[this.var_short_arr_a[311] + 229 + this.aT + this.var_byte_ak];
        this.aR = this.var_byte_arr_a[this.var_short_arr_a[155] + 84 + this.aS] < 0 ? -1 : 0;
        this.var_byte_al = this.var_byte_arr_a[this.var_short_arr_a[311] + 0 + this.aT + this.var_byte_ak];
        this.var_byte_am = this.var_byte_arr_p[this.var_byte_al];
        this.var_byte_an = this.var_byte_arr_a[this.var_short_arr_a[311] + 458 + this.aT + this.var_byte_ak];
        if (this.var_byte_an > 100) {
            this.f(this.var_byte_an, -2);
        } else if (this.var_byte_an == 99) {
            this.var_byte_am = this.var_byte_arr_p[0];
            this.f(this.var_byte_am, -2);
        } else if (this.var_byte_an > 0) {
            this.f(this.var_byte_arr_p[this.var_byte_an], -2);
        } else if (this.var_byte_an == -100) {
            if (this.var_byte_ai == 51) {
                this.var_byte_I = (byte)8;
                this.var_byte_K = (byte)67;
            }
            this.f(-100, -2);
        } else if (this.var_byte_an < 0) {
            this.f(this.var_byte_an, -3);
            if (this.var_byte_ai == 36 || this.var_byte_ai == 38) {
                this.var_byte_I = (byte)(this.var_byte_I + 4);
                this.var_byte_K = (byte)(this.var_byte_K - 1);
            }
        }
        this.var_boolean_H = true;
    }

    private void S() {
        this.aJ();
        this.t();
        this.var_byte_ak = 0;
        this.var_int_Z = 0;
        this.var_c_a.a(this.var_byte_ai);
        this.aT = this.var_byte_arr_a[this.var_short_arr_a[310] + 0 + this.var_byte_ai] & 0xFF;
        this.var_byte_ao = this.var_byte_arr_a[this.var_short_arr_a[311] + 229 + this.aT];
        if (this.var_byte_ai == 4 || this.var_byte_ao == 0) {
            this.var_byte_ao = (byte)27;
            this.var_byte_arr_a[this.var_short_arr_a[311] + 229 + this.aT] = 27;
        }
        this.var_byte_aj = (byte)((this.var_byte_arr_a[this.var_short_arr_a[310] + 0 + this.var_byte_ai + 1] & 0xFF) - this.aT);
        this.var_boolean_J = this.var_byte_ao >= 27;
        this.var_byte_v = 0;
        this.var_byte_R = this.var_byte_Q;
        this.var_byte_Q = (byte)17;
        this.aP = this.var_byte_arr_a[this.var_short_arr_a[155] + 56 + this.var_byte_ao];
        if (this.aP == 1) {
            this.O();
        }
        if (this.var_byte_ao != 9 && !this.var_boolean_J && this.aP != 1) {
            this.var_byte_K = (byte)(this.var_byte_K - 1);
        }
        this.var_boolean_arr_d = new boolean[]{this.var_boolean_arr_a[0], this.var_boolean_arr_a[1], this.var_boolean_arr_a[2], this.var_boolean_arr_a[4], this.var_boolean_arr_a[5], this.var_boolean_arr_a[6], this.var_boolean_arr_a[7], this.var_boolean_arr_a[8], this.var_boolean_arr_a[9]};
        this.a(true, true, false, false);
        this.var_boolean_s = true;
        byte by = this.var_byte_arr_a[this.var_short_arr_a[310] + 71 + this.var_byte_ai];
        System.arraycopy(this.var_byte_arr_a, this.var_short_arr_a[156] + this.var_byte_arr_a[this.var_short_arr_a[157] + by], this.var_byte_arr_p, 0, this.var_byte_arr_a[this.var_short_arr_a[157] + by + 1] - this.var_byte_arr_a[this.var_short_arr_a[157] + by]);
    }

    private void T() {
        if (this.var_byte_ai == 3) {
            this.d(5, 20, 2);
            this.var_byte_arr_e[6161 + this.var_byte_arr_p[2]] = 3;
            this.var_byte_arr_e[2828 + this.var_byte_arr_p[2]] = 105;
            this.var_byte_arr_e[6262 + this.var_byte_arr_p[2]] = 5;
            this.var_byte_arr_e[6363 + this.var_byte_arr_p[2]] = 10;
            this.var_byte_arr_e[1313 + this.var_byte_arr_p[2]] = 3;
            this.var_byte_arr_e[5050 + this.var_byte_arr_p[2]] = -1;
            return;
        }
        if (this.var_byte_ai == 37) {
            this.var_b_a.l();
            this.var_byte_aw = 1;
            this.var_b_a.a(4, 46, 9, (byte)0, (byte)9);
            this.a((byte)0, (byte)48, (byte)9, (byte)3, (byte)0);
            this.var_byte_arr_e[2934] = 14;
            this.var_byte_arr_e[611] = 2;
            this.var_byte_aw = (byte)2;
            this.var_b_a.a(1, 44, 9, (byte)1, (byte)2);
            this.var_b_a.a(1, 45, 11, (byte)1, (byte)2);
            this.var_byte_arr_e[658] = 7;
            this.var_b_a.a(1, 48, 11, (byte)1, (byte)2);
            this.var_byte_arr_e[659] = 5;
            this.var_b_a.a(2, 48, 9, (byte)1, (byte)2);
            this.var_short_arr_arr_a[0][17] = 0;
            return;
        }
        if (this.var_byte_ai == 38) {
            this.var_b_a.l();
            this.a((byte)0, 2, 52, 18, 2, true, -1);
            this.a((byte)0, 2, 54, 16, 2, true, -1);
            this.a((byte)0, 2, 55, 19, 2, true, -1);
            this.a((byte)0, 2, 58, 19, 2, true, -1);
            this.var_byte_aw = 0;
            this.var_b_a.a(5, 60, 12, (byte)0, (byte)0);
            this.var_byte_aw = (byte)2;
            this.d(57, 17, 1);
            this.var_c_a.a();
            return;
        }
        if (this.var_byte_ai == 43) {
            this.void_b(52, 7);
            return;
        }
        if (this.var_byte_ai == 45) {
            this.var_b_a.m();
            this.void_b(57, 30);
            this.b(1, 54, 30, 5);
            this.b(1, 54, 31, 5);
            this.b(1, 55, 31, 5);
            this.b(1, 55, 32, 5);
            return;
        }
        if (this.var_byte_ai == 48) {
            this.var_byte_q = (byte)2;
            this.aM();
            this.var_b_a.var_byte_f = (byte)6;
            this.aN();
            this.var_byte_q = (byte)3;
            this.a((byte)0, 24, 18, 67, 2, true, -1);
            this.a((byte)0, 25, 19, 69, 2, true, -1);
            this.a((byte)0, 25, 21, 71, 2, true, -1);
            this.var_short_arr_arr_a[0][12] = 0;
            this.a((byte)0, (byte)26, (byte)69, (byte)60, (byte)0);
            this.var_short_arr_arr_a[0][17] = 1;
            this.var_b_a.a(7, 26, 69, (byte)0, (byte)2);
            this.d(23, 69, 1);
            this.var_b_a.a(2, 1, 69, (byte)1, (byte)3);
            this.a((byte)1, (byte)21, (byte)69, (byte)60, (byte)0);
            this.var_byte_arr_e[659] = 0;
            this.var_byte_arr_e[2982] = 42;
            this.f(53, -2);
            this.var_byte_arr_e[657] = 0;
        }
    }

    private void U() {
        int n;
        this.var_b_a.d();
        if (this.var_byte_ai == 26) {
            this.var_boolean_s = false;
            this.void_c();
            this.var_boolean_s = true;
        }
        if (this.var_byte_ao == 9) {
            this.var_b_a.f();
        } else if (this.var_byte_ai == 28) {
            this.d(5, 11, 0);
            this.var_b_a.var_byte_I = (byte)(this.var_b_a.var_byte_I & 0xFE);
            this.var_b_a.var_short_arr_d[this.var_byte_arr_a[this.var_short_arr_a[292] + 4]] = 0;
        } else if (this.var_byte_ai == 34) {
            this.d(48, 15, 5);
            this.var_b_a.var_byte_I = 0;
        } else if (this.var_byte_ai == 38) {
            this.d(65, 18, 1);
            this.var_byte_u = 1;
        } else if (this.var_byte_ai == 44) {
            for (n = 0; n < 10; ++n) {
                this.var_byte_arr_e[9601 + n] = this.var_byte_am;
            }
            this.d(53, 5, 0);
            this.f(this.var_byte_am, -2);
            this.var_c_a.a();
        } else if (this.var_byte_ai == 48) {
            this.var_byte_u = 1;
            this.d(45, 69, 6);
        }
        for (n = 0; n < this.var_byte_arr_p.length; ++n) {
            if (this.var_byte_arr_e[2828 + this.var_byte_arr_p[n]] == 105) {
                this.var_byte_arr_e[2828 + this.var_byte_arr_p[n]] = this.var_byte_arr_e[4646 + this.var_byte_arr_p[n]] < 0 ? 69 : 57;
            }
            this.var_byte_arr_p[n] = 0;
        }
        if (this.var_b_a.var_byte_f >= 50) {
            this.var_b_a.var_int_F = this.var_byte_ai == 15 ? 1000000 : this.var_int_c;
            this.var_b_a.var_byte_f = (byte)(this.var_b_a.var_byte_f - 49);
            this.var_b_a.var_byte_g = this.var_byte_arr_a[this.var_short_arr_a[294] + this.var_b_a.var_byte_f - 1];
            this.var_b_a.var_byte_J = 0;
        }
        if (this.var_byte_ao != 9) {
            this.var_byte_J = this.var_byte_I;
            this.var_byte_K = !this.var_boolean_J || this.var_boolean_arr_d[3] ? (byte)(this.var_byte_K + 1) : this.var_byte_K;
            this.var_byte_L = this.var_byte_K;
        } else {
            this.var_byte_I = this.var_byte_J;
            this.var_byte_K = this.var_byte_L;
        }
        this.var_boolean_s = false;
        this.aK();
        this.var_byte_J = this.var_byte_I;
        this.var_byte_L = this.var_byte_K;
        if (this.var_byte_ai == 0 || this.var_byte_ai == 1 || this.var_byte_ai == 2 && this.var_byte_p != 0 || this.var_byte_ai == 32 || this.var_byte_ai == 36 || this.var_byte_ai == 37 || this.var_byte_ai == 39 || this.var_byte_ai == 46 || this.var_byte_ai == 47 || this.var_byte_ai == 49 || this.var_byte_ai == 55) {
            this.var_byte_ai = (byte)(this.var_byte_ai + 1);
            this.var_byte_Q = (byte)28;
            this.void_b((int)this.var_byte_ai);
            if (this.var_byte_ai == 47) {
                this.var_byte_Q = (byte)18;
                this.var_byte_o = this.var_byte_arr_a[this.var_short_arr_a[154] + 8];
            }
            return;
        }
        if (this.var_byte_ai != 59) {
            this.var_byte_v = 1;
        }
        this.var_boolean_A = true;
        this.a(this.var_boolean_arr_d[0], this.var_boolean_arr_d[1], this.var_boolean_arr_d[2], this.var_boolean_arr_d[3], this.var_boolean_arr_d[4], this.var_boolean_arr_d[5], this.var_boolean_arr_d[6], this.var_boolean_arr_d[7], this.var_boolean_arr_d[8]);
        this.var_byte_Q = this.var_byte_R;
    }

    private void d(int n, int n2, int n3) {
        for (int i = 0; i < this.var_byte_arr_p.length; ++i) {
            if (i != n3 && i < 6) continue;
            this.e(n, n2, this.var_byte_arr_p[i]);
        }
    }

    private void e(int n, int n2, int n3) {
        this.var_byte_arr_e[2828 + n3] = 69;
        this.var_byte_arr_e[3131 + n3] = (byte)n;
        this.var_byte_arr_e[3232 + n3] = (byte)n2;
        this.var_byte_arr_e[6161 + n3] = 2;
        this.var_byte_arr_e[4747 + n3] = 0;
        int n4 = 7979 + n3;
        this.var_byte_arr_e[n4] = (byte)(this.var_byte_arr_e[n4] & 0xBF);
    }

    final void void_c() {
        this.var_short_c = this.var_short_e;
        this.var_short_d = this.var_short_f;
        this.var_byte_q = (byte)(this.var_byte_q + 1);
        this.aP();
        this.var_b_a.var_int_G = this.var_short_arr_a[219] + this.var_byte_q * 4;
    }

    final void a(byte by, byte by2, byte by3) {
        if (by < 18 && (this.var_int_l == 0 || this.var_byte_Q == 17 || by != 18 && this.var_boolean_K || this.var_byte_u > 0)) {
            return;
        }
        this.var_int_Z = 0;
        this.var_int_o = 0;
        this.i();
        this.var_byte_ap = by;
        this.var_byte_v = 0;
        this.var_byte_Q = (byte)20;
        this.var_boolean_H = true;
        this.var_int_v = 12 + by;
        this.var_byte_am = by2;
        this.var_byte_an = by3;
        this.var_boolean_arr_d = new boolean[]{this.var_boolean_arr_a[0], this.var_boolean_arr_a[1], this.var_boolean_arr_a[2], this.var_boolean_arr_a[4], this.var_boolean_arr_a[5], this.var_boolean_arr_a[6], this.var_boolean_arr_a[7], this.var_boolean_arr_a[8], this.var_boolean_arr_a[9]};
        this.a(this.var_boolean_arr_a[0], true, false, this.var_boolean_arr_a[4]);
        this.var_boolean_A = true;
        if (by == 4 || by == 5 || by == 14 || by == 15) {
            this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + 20] = 0;
            return;
        }
        this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + 20] = 2;
    }

    protected final void keyPressed(int n) {
        if (this.var_boolean_n) {
            return;
        }
        if (this.var_boolean_o) {
            return;
        }
        this.var_boolean_o = true;
        if (!f.boolean_a(n)) {
            return;
        }
        this.var_byte_j = 0;
        if (n == var_int_a || n == -var_int_a || n == 42) {
            var_boolean_l = true;
            return;
        }
        if (n == var_int_b || n == -var_int_b || n == 35) {
            var_boolean_m = true;
            return;
        }
        switch (n) {
            case 42: {
                break;
            }
            case 35: {
                break;
            }
            case 48: {
                this.var_byte_i = 0;
                break;
            }
            case 49: {
                this.var_byte_i = 1;
                this.var_boolean_w = true;
                break;
            }
            case 51: {
                this.var_byte_i = (byte)3;
                this.var_boolean_w = true;
                break;
            }
            case 55: {
                this.var_byte_i = (byte)7;
                this.var_boolean_w = true;
                break;
            }
            case 57: {
                this.var_byte_i = (byte)9;
                this.var_boolean_w = true;
            }
        }
        if (this.var_boolean_a && this.var_boolean_y) {
            this.m(n);
        }
        try {
            this.var_int_m = this.getGameAction(n);
        }
        catch (Exception exception) {
            this.var_int_m = 666;
        }
        if (this.var_int_m == 8 || n == 53) {
            this.var_boolean_i = true;
            this.var_boolean_t = true;
            ++this.var_int_n;
            if (!this.var_boolean_u) {
                this.var_byte_E = 0;
                return;
            }
        } else {
            if (this.var_int_m == 1 || n == 50) {
                this.var_boolean_e = true;
                return;
            }
            if (this.var_int_m == 6 || n == 56) {
                this.var_boolean_f = true;
                return;
            }
            if (this.var_int_m == 2 || n == 52) {
                this.var_boolean_g = true;
                return;
            }
            if (this.var_int_m == 5 || n == 54) {
                this.var_boolean_h = true;
            }
        }
    }

    protected final void keyReleased(int n) {
        if (this.var_boolean_n) {
            return;
        }
        if (!f.boolean_a(n)) {
            return;
        }
        this.var_byte_j = 0;
        switch (n) {
            case 42: {
                break;
            }
            case 35: {
                break;
            }
            case 48: {
                break;
            }
            case 49: {
                this.var_boolean_w = false;
                break;
            }
            case 51: {
                this.var_boolean_w = false;
                break;
            }
            case 55: {
                this.var_boolean_w = false;
                break;
            }
            case 57: {
                this.var_boolean_w = false;
            }
        }
        try {
            this.var_int_m = this.getGameAction(n);
        }
        catch (Exception exception) {
            this.var_int_m = 666;
        }
        if (n == 53 || this.var_int_m == 8) {
            this.var_boolean_t = false;
            if (this.var_byte_E < 4) {
                this.var_boolean_v = true;
            }
        }
        if (this.var_boolean_o) {
            this.var_boolean_p = true;
            return;
        }
        if (n == 50 || this.var_int_m == 1) {
            this.var_boolean_e = false;
            return;
        }
        if (n == 56 || this.var_int_m == 6) {
            this.var_boolean_f = false;
            return;
        }
        if (n == 52 || this.var_int_m == 2) {
            this.var_boolean_g = false;
            return;
        }
        if (n == 54 || this.var_int_m == 5) {
            this.var_boolean_h = false;
        }
    }

    private static boolean boolean_a(int n) {
        return n != -10;
    }

    private void V() {
        this.W();
        if (this.var_boolean_u && this.var_boolean_i) {
            this.var_boolean_i = false;
            this.aF();
        } else if (this.var_boolean_t && this.var_byte_w != 3) {
            this.var_boolean_i = false;
            this.aE();
        } else {
            this.var_int_F = 0;
        }
        if (this.var_int_I >= 4 && this.var_byte_w == 1) {
            this.aG();
        } else if (this.var_int_I > 0 && this.var_int_I < 4 && !this.var_boolean_w) {
            this.aH();
        }
        if (this.var_boolean_v) {
            this.var_boolean_v = false;
            this.var_byte_E = (byte)4;
            this.var_boolean_i = false;
            byte by = this.var_byte_arr_arr_c[this.var_byte_K + this.var_byte_A][this.var_byte_I + this.var_byte_y];
            if (this.var_byte_w == 1 && this.var_byte_W >= 51 && this.var_byte_W <= 100) {
                this.var_byte_y = (byte)(this.var_byte_arr_e[0 + this.var_byte_W] - this.var_byte_I);
                this.var_byte_A = (byte)(this.var_byte_arr_e[101 + this.var_byte_W] - this.var_byte_K);
                this.e(this.var_byte_W);
            } else if (this.var_byte_w == 1 && f.byte_a(by) != 0) {
                this.e(by);
            } else if (this.var_byte_w == 3) {
                this.X();
            } else if (f.byte_a(by) == 0) {
                this.d(by);
            } else if (this.var_byte_w == 0 && f.byte_b(by) == 0) {
                this.f(-by);
            } else if (f.byte_a(this.var_byte_W) == 0) {
                this.d(this.var_byte_W);
                this.var_byte_y = (byte)(this.var_byte_arr_e[0 + this.var_byte_W] - this.var_byte_I);
                this.var_byte_A = (byte)(this.var_byte_arr_e[101 + this.var_byte_W] - this.var_byte_K);
            }
            this.var_boolean_E = true;
            this.var_int_e = 0;
        }
        this.aL();
        if (this.var_int_af == 0 && this.var_int_ag == 0 && !this.var_boolean_C) {
            this.Y();
            this.var_int_ad = this.var_int_af * 11;
            this.var_int_ae = this.var_int_ag * 8;
        }
    }

    private void W() {
        if (var_boolean_l) {
            var_boolean_l = false;
            if (this.var_byte_w != 3) {
                this.a(true, false, false, false, true, false, false, false, false);
                this.var_byte_w = (byte)2;
                this.Z();
            }
        } else if (var_boolean_m) {
            var_boolean_m = false;
            if (this.var_byte_w == 3) {
                this.var_int_s = 0;
                this.l(-1);
            } else {
                if (this.var_byte_w == 1 || this.var_byte_F != -1) {
                    this.var_boolean_k = true;
                    return;
                }
                this.var_byte_v = 0;
                this.var_byte_Q = (byte)(this.var_byte_q < 7 ? (this.var_byte_t > -1 ? 10 : 11) : (this.var_boolean_W ? 10 : 11));
                this.var_byte_R = (byte)28;
                this.var_int_Z = 0;
                this.var_boolean_H = true;
                this.var_boolean_X = false;
                this.var_byte_z = this.var_byte_y;
                this.var_byte_B = this.var_byte_A;
                this.var_byte_J = this.var_byte_I;
                this.var_byte_L = this.var_byte_K;
                return;
            }
        }
        if (this.var_byte_i == 1) {
            this.var_byte_i = (byte)-1;
            if (this.var_byte_ay == 1) {
                this.var_byte_ay = 0;
                this.var_byte_y = this.var_byte_C;
                this.var_byte_I = (byte)(this.var_byte_arr_arr_k[0][0] - this.var_byte_y);
                this.var_byte_A = this.var_byte_D;
                this.var_byte_K = (byte)(this.var_byte_arr_arr_k[1][0] - this.var_byte_A);
                this.aK();
                this.var_boolean_A = true;
            }
            return;
        }
        if (this.var_byte_i == 3) {
            this.var_byte_i = (byte)-1;
            if (this.var_byte_q == 3) {
                this.a((byte)20, (byte)1, (byte)0);
                return;
            }
            this.var_byte_v = 0;
            this.var_byte_Q = (byte)19;
            this.var_boolean_H = true;
            this.var_int_v = -1;
            this.var_boolean_R = true;
            this.var_boolean_Q = true;
            this.var_boolean_c = true;
            this.var_byte_z = this.var_byte_y;
            this.var_byte_B = this.var_byte_A;
            this.var_byte_J = this.var_byte_I;
            this.var_byte_L = this.var_byte_K;
            this.E();
            this.i();
            return;
        }
    }

    private void X() {
        if (this.var_boolean_r) {
            if (this.var_int_s == 100) {
                if (this.var_boolean_O) {
                    this.var_boolean_N = this.var_boolean_O;
                    this.var_boolean_M = false;
                    this.var_boolean_L = false;
                    this.var_b_a.b();
                } else if (this.var_boolean_M) {
                    this.var_boolean_L = this.var_boolean_M;
                    this.var_b_a.b();
                }
                this.var_byte_arr_q[0] = (byte)(this.var_byte_I + this.var_byte_y);
                this.var_byte_arr_q[1] = (byte)(this.var_byte_K + this.var_byte_A);
                this.l(-1);
                return;
            }
            if (this.var_int_s < 0) {
                this.var_byte_arr_e[3131 + this.var_int_r] = this.var_byte_arr_e[8383 + this.var_int_q];
                this.var_byte_arr_e[3232 + this.var_int_r] = this.var_byte_arr_e[8444 + this.var_int_q];
                this.var_byte_arr_e[2828 + this.var_int_r] = (byte)(44 + -this.var_int_s - 1);
                this.var_byte_arr_e[6161 + this.var_int_r] = 3;
                return;
            }
            if (this.var_int_s <= 3) {
                this.var_byte_n = 0;
                while (this.var_byte_n < 29 && this.var_byte_arr_arr_arr_b[0][0][this.var_byte_n] != 0) {
                    this.var_byte_n = (byte)(this.var_byte_n + 1);
                }
                this.var_byte_arr_arr_arr_b[0][1][this.var_byte_n] = (byte)this.var_int_s;
                if (this.var_byte_arr_arr_arr_b[0][1][this.var_byte_n] == 3) {
                    this.var_byte_arr_arr_arr_b[0][0][this.var_byte_n] = (byte)this.var_int_q;
                    this.var_byte_arr_arr_arr_b[0][2][this.var_byte_n] = (byte)(this.var_byte_I + this.var_byte_y);
                    this.var_byte_arr_arr_arr_b[0][3][this.var_byte_n] = (byte)(this.var_byte_K + this.var_byte_A);
                    this.l(-1);
                    return;
                }
                if (f.byte_a(this.var_int_r) == 0) {
                    this.var_byte_arr_arr_arr_b[0][0][this.var_byte_n] = (byte)this.var_int_q;
                    this.var_byte_arr_arr_arr_b[0][2][this.var_byte_n] = (byte)this.var_int_r;
                    return;
                }
            } else if (this.boolean_b(this.var_byte_I + this.var_int_t, this.var_byte_K + this.var_int_u) && this.a((byte)0, this.var_int_s, this.var_byte_I + this.var_int_t, this.var_byte_K + this.var_int_u, 1, false, -1) > 0) {
                this.l(-1);
                this.var_byte_w = (byte)2;
            }
        }
    }

    private void d(byte by) {
        if (this.var_int_n > 1) {
            this.var_int_n = 0;
            this.var_int_B = this.var_byte_I - 1;
            this.var_int_C = this.var_byte_K - 1;
            this.var_int_D = this.var_byte_O;
            this.var_int_E = this.var_byte_P;
            this.var_boolean_u = true;
            this.var_boolean_t = true;
            this.aF();
            this.a(true, true, false, false);
            this.var_byte_l = 0;
            this.var_byte_k = 0;
            return;
        }
        if (this.var_byte_arr_e[1919 + by] > 0) {
            this.a(false, true, false, true);
            this.var_byte_w = 1;
            this.var_byte_k = this.var_byte_l = by;
            this.var_byte_F = (byte)-1;
        }
    }

    private void e(byte by) {
        if (this.var_byte_F != -1) {
            for (int i = 0; i < 50; ++i) {
                if (this.var_byte_arr_arr_a[this.var_byte_F][i] <= 0) continue;
                this.a(this.var_byte_arr_arr_a[this.var_byte_F][i], by);
            }
        } else {
            this.a(this.var_byte_k, by);
        }
        this.var_int_n = 0;
    }

    private void a(byte by, byte by2) {
        if (!(this.var_byte_arr_e[505 + by] >= 10 || this.var_boolean_N || this.var_boolean_L && (this.var_byte_arr_e[7979 + by] & 0x40) != 0)) {
            this.var_b_a.a((byte)12, (int)by, 0);
            return;
        }
        if (f.byte_b(by2) == 0 && this.var_byte_arr_e[8749 + -by2] == 6) {
            this.a(true, false, true, false);
            this.var_int_q = -by2;
            this.var_byte_w = (byte)2;
            this.Z();
            return;
        }
        if (this.var_int_n > 1 || this.var_byte_arr_e[3131 + by] == this.var_byte_y + this.var_byte_I && this.var_byte_arr_e[3232 + by] == this.var_byte_A + this.var_byte_K) {
            this.var_boolean_q = true;
            if (this.var_byte_arr_e[7777 + by] == 0) {
                this.var_byte_arr_e[7777 + by] = 3;
                this.var_b_a.b((int)by);
                if (this.var_byte_arr_e[7777 + by] > 0) {
                    this.var_byte_arr_e[1111 + by] = (byte)((this.var_byte_arr_e[1111 + by] & 0xF0) + this.var_byte_arr_a[this.var_short_arr_a[129 + (this.var_byte_arr_e[606 + by] & 1) * 2] + this.var_byte_arr_a[this.var_short_arr_a[129 + (this.var_byte_arr_e[606 + by] & 1) * 2 + 1] + this.var_byte_arr_e[1010 + by] - 5] + (this.var_byte_arr_e[1111 + by] & 0xF)]);
                }
            }
        } else if (this.var_byte_arr_e[7777 + by] > 0) {
            this.var_byte_arr_e[1111 + by] = (byte)((this.var_byte_arr_e[1111 + by] & 0xF0) + this.var_byte_arr_a[this.var_short_arr_a[133 + (this.var_byte_arr_e[606 + by] & 1) * 2] + this.var_byte_arr_a[this.var_short_arr_a[133 + (this.var_byte_arr_e[606 + by] & 1) * 2 + 1] + this.var_byte_arr_e[1010 + by] - 5] + (this.var_byte_arr_e[1111 + by] & 0xF)]);
            this.var_byte_arr_e[7777 + by] = 0;
        }
        this.var_byte_arr_e[3131 + by] = (byte)(this.var_byte_y + this.var_byte_I);
        this.var_byte_arr_e[3232 + by] = (byte)(this.var_byte_A + this.var_byte_K);
        int n = 7979 + by;
        this.var_byte_arr_e[n] = (byte)(this.var_byte_arr_e[n] & 0xDF);
        this.var_byte_arr_e[6161 + by] = 2;
        this.var_byte_arr_e[4747 + by] = by2;
        this.var_byte_ab = (byte)(this.var_byte_y + this.var_byte_I);
        this.var_byte_ac = (byte)(this.var_byte_A + this.var_byte_K);
        this.var_byte_aa = (f.byte_a(by2) == 1 || f.byte_b(by2) == 1 || f.boolean_b(by2)) && this.byte_a(this.var_byte_y + this.var_byte_I, this.var_byte_A + this.var_byte_K) == 0 ? 2 : 1;
    }

    final void void_c(int n) {
        for (int i = (n - 1) / 50 * 30 + 1; i <= (n - 1) / 50 * 30 + 30; ++i) {
            if (this.var_byte_arr_e[8810 + i] == n && (this.var_byte_arr_e[8749 + i] != 2 || this.var_byte_arr_e[8627 + i] != 0)) {
                this.a(i, false);
                this.var_byte_arr_e[8810 + i] = 0;
                this.var_byte_arr_e[9298 + i] = 0;
                return;
            }
            if (this.var_byte_arr_e[8627 + i] != 2 && this.var_byte_arr_e[8627 + i] != 1 || this.var_byte_arr_e[9237 + i] != n) continue;
            this.var_byte_arr_e[9237 + i] = 0;
        }
    }

    final void a(int n, boolean bl) {
        byte by = this.var_byte_arr_e[8993 + n];
        while (by > 0) {
            if (!(this.var_byte_arr_e[4646 + by] == 0 && !bl || this.var_byte_arr_e[8749 + n] == 11 && this.var_byte_arr_e[8627 + n] == 0 && this.var_byte_arr_a[this.var_short_arr_a[18] + this.var_byte_arr_e[6565 + by]] != 0 || this.var_byte_arr_e[2929 + by] == -108 || this.var_byte_arr_e[2929 + by] == this.var_byte_arr_a[this.var_short_arr_a[173] + this.var_byte_arr_a[this.var_short_arr_a[174] + this.var_byte_arr_e[8749 + n]] + this.var_byte_arr_e[4646 + by]] || this.var_byte_arr_e[2929 + by] == this.var_byte_arr_a[this.var_short_arr_a[176] + this.var_byte_arr_a[this.var_short_arr_a[177] + this.var_byte_arr_e[8749 + n]] + this.var_byte_arr_e[4646 + by]])) {
                this.a((int)by, n, false, false);
            }
            by = this.var_byte_arr_e[4545 + by];
        }
    }

    private void f(byte by) {
        if (this.var_byte_arr_e[8749 + by] == 3 && this.var_byte_arr_e[4444 + this.var_short_arr_arr_a[0][17]] != by) {
            this.var_byte_as = 0;
            this.var_byte_arr_r[0] = 0;
            this.l(4);
            return;
        }
        this.a(true, false, true, false);
        this.var_int_q = by;
        this.var_byte_w = (byte)2;
        this.var_byte_k = 0;
        this.Z();
    }

    private void Y() {
        if (this.var_boolean_B) {
            return;
        }
        if (this.var_boolean_g) {
            if (this.var_byte_y > this.var_byte_C) {
                this.var_byte_y = (byte)(this.var_byte_y - 1);
                return;
            }
            if (this.var_byte_I > 0) {
                this.var_byte_I = (byte)(this.var_byte_I - 1);
                this.var_int_af = -1;
                return;
            }
            if (this.var_byte_y > 0) {
                this.var_byte_y = (byte)(this.var_byte_y - 1);
                return;
            }
        } else if (this.var_boolean_h) {
            if (this.var_byte_y < this.var_byte_C) {
                this.var_byte_y = (byte)(this.var_byte_y + 1);
                return;
            }
            if (this.var_byte_I < this.var_short_c - this.var_byte_O) {
                this.var_byte_I = (byte)(this.var_byte_I + 1);
                this.var_int_af = 1;
                return;
            }
            if (this.var_byte_I + this.var_byte_y < this.var_short_c - 1 - 0) {
                this.var_byte_y = (byte)(this.var_byte_y + 1);
                return;
            }
        } else if (this.var_boolean_e) {
            if (this.var_byte_A > this.var_byte_D) {
                this.var_byte_A = (byte)(this.var_byte_A - 1);
                return;
            }
            if (this.var_byte_K > 0 && !this.var_boolean_arr_a[4] || this.var_byte_K > 1 && this.var_boolean_arr_a[4]) {
                this.var_byte_K = (byte)(this.var_byte_K - 1);
                this.var_int_ag = -1;
                return;
            }
            if (this.var_byte_A > 0) {
                this.var_byte_A = (byte)(this.var_byte_A - 1);
                return;
            }
        } else if (this.var_boolean_f) {
            if (this.var_byte_A < this.var_byte_D) {
                this.var_byte_A = (byte)(this.var_byte_A + 1);
                return;
            }
            if (this.var_byte_K < this.var_short_d - this.var_byte_P - 1 - (this.ba >> 5)) {
                this.var_byte_K = (byte)(this.var_byte_K + 1);
                this.var_int_ag = 1;
                return;
            }
            if (this.var_byte_K + this.var_byte_A < this.var_short_d - 2 - 0 - (this.ba >> 5)) {
                this.var_byte_A = (byte)(this.var_byte_A + 1);
            }
        }
    }

    private void Z() {
        try {
            int n;
            if (!(this.var_boolean_arr_a[2] || this.var_boolean_arr_a[5] || this.var_boolean_arr_a[6])) {
                return;
            }
            this.var_byte_ar = 0;
            for (n = 0; n < this.var_byte_arr_r.length; n = (int)((byte)(n + 1))) {
                this.var_byte_arr_r[n] = 0;
            }
            this.var_byte_at = (byte)99;
            if (this.var_boolean_arr_a[2]) {
                this.aa();
                this.ab();
                this.ac();
            } else if (this.var_boolean_arr_a[5]) {
                this.ad();
            } else if (this.var_boolean_arr_a[6]) {
                n = this.var_byte_q > 1 ? 11 : (this.var_byte_ai < 18 ? 3 : 6);
                for (int n2 = 0; n2 < n; n2 = (int)((byte)(n2 + 1))) {
                    this.var_byte_arr_r[n2] = this.var_byte_arr_a[this.var_short_arr_a[137] + n2];
                    this.var_byte_ar = (byte)(this.var_byte_ar + 1);
                }
            } else {
                this.ah();
                return;
            }
            if (this.var_boolean_P) {
                while (this.aX + this.aW > this.var_byte_ar && this.var_byte_as != 0) {
                    if (this.aX > 0) {
                        --this.aX;
                    }
                    this.var_byte_as = (byte)(this.var_byte_as - 1);
                }
            } else {
                this.var_byte_as = 0;
                this.aX = 0;
                this.var_byte_l = 0;
            }
            this.var_boolean_arr_b[this.var_byte_ad] = true;
            this.aW = aU;
            if (this.var_byte_ar < this.aW) {
                this.aW = this.var_byte_ar;
            }
            this.aZ = aV * this.aW;
            this.aY = (240 - this.aZ + 9) / 2;
            this.ai();
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void aa() {
        if (this.var_byte_arr_e[8749 + this.var_int_q] == 0) {
            this.var_byte_au = 0;
            while (this.var_byte_arr_arr_arr_a[0][this.var_byte_au][11] != this.var_int_q) {
                this.var_byte_au = (byte)(this.var_byte_au + 1);
            }
            this.var_byte_av = (byte)-1;
            int n = this.var_byte_arr_e[9115 + this.var_int_q] - 1;
            for (byte by = this.var_byte_arr_a[this.var_short_arr_a[144] + n]; by < this.var_byte_arr_a[this.var_short_arr_a[144] + n + 1]; by = (byte)(by + 1)) {
                if (0 + this.var_byte_arr_a[this.var_short_arr_a[143] + by] >= 6 && this.var_byte_av == -1) {
                    this.var_byte_av = (byte)(by - this.var_byte_arr_a[this.var_short_arr_a[144] + n]);
                }
                this.var_byte_arr_r[this.var_byte_ar] = this.var_byte_arr_a[this.var_short_arr_a[143] + by];
                this.var_byte_arr_s[by - this.var_byte_arr_a[this.var_short_arr_a[144] + n]] = this.var_byte_arr_arr_arr_a[0][this.var_byte_au][this.var_byte_arr_a[this.var_short_arr_a[143] + by]];
                this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            }
            this.var_byte_at = (byte)9;
            return;
        }
        if (this.var_byte_arr_e[8749 + this.var_int_q] == 6) {
            int n;
            if (this.var_byte_k > 0) {
                if (this.var_byte_arr_e[3636 + this.var_byte_k] > 0) {
                    this.var_byte_arr_r[this.var_byte_ar] = 29;
                    this.var_byte_ar = (byte)(this.var_byte_ar + 1);
                }
            } else if (this.var_byte_F != -1) {
                n = 0;
                while (this.var_byte_arr_arr_a[this.var_byte_F][n] != 0) {
                    if (this.var_byte_arr_e[3636 + this.var_byte_arr_arr_a[this.var_byte_F][n]] > 0) {
                        this.var_byte_arr_r[this.var_byte_ar] = 29;
                        this.var_byte_ar = (byte)(this.var_byte_ar + 1);
                        break;
                    }
                    n = (byte)(n + 1);
                }
            }
            this.var_short_arr_arr_a[0][6] = (short)(this.var_short_arr_arr_a[0][3] / 5);
            if (this.var_short_arr_arr_a[0][6] > this.var_byte_at) {
                this.var_short_arr_arr_a[0][6] = this.var_byte_at;
            }
            for (n = 0; n < 6; n = (int)((byte)(n + 1))) {
                if (this.var_short_arr_arr_a[0][5 + n] <= 0) continue;
                this.var_byte_arr_r[this.var_byte_ar] = n;
                this.var_byte_arr_s[this.var_byte_ar] = (byte)this.var_short_arr_arr_a[0][5 + n];
                this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            }
            return;
        }
        if (this.var_byte_arr_e[8749 + this.var_int_q] == 8) {
            for (int n = 0; n < this.var_byte_arr_e[9115 + this.var_int_q] * 2; n = (int)((byte)(n + 1))) {
                this.var_byte_arr_r[this.var_byte_ar] = (byte)(19 + n);
                this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            }
        }
    }

    private void ab() {
        int n;
        for (n = 0; n < 8; n = (int)((byte)(n + 1))) {
            this.var_byte_arr_j[n] = 0;
        }
        n = 0;
        int n2 = 0;
        if (this.var_byte_arr_e[8810 + this.var_int_q] > 0 && (this.var_byte_arr_e[8749 + this.var_int_q] != 2 || this.var_byte_arr_e[8627 + this.var_int_q] != 0)) {
            this.var_byte_arr_j[0] = this.var_byte_arr_e[8810 + this.var_int_q];
            ++n2;
            n = 1;
        }
        byte by = this.var_byte_arr_e[8993 + this.var_int_q];
        while (by > 0) {
            if (this.var_byte_arr_e[1313 + by] > 0 && (this.var_byte_arr_e[8810 + this.var_int_q] != by || this.var_byte_arr_e[8749 + this.var_int_q] == 2 && this.var_byte_arr_e[8627 + this.var_int_q] == 0)) {
                this.var_byte_arr_j[n + this.var_byte_arr_e[4646 + by]] = by;
                ++n2;
            }
            by = this.var_byte_arr_e[4545 + by];
        }
        by = 0;
        for (int n3 = 0; n3 < n2; n3 = (int)((byte)(n3 + 1))) {
            while (this.var_byte_arr_j[by] == 0) {
                by = (byte)(by + 1);
            }
            this.var_byte_arr_r[this.var_byte_ar] = -this.var_byte_arr_j[by];
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            by = (byte)(by + 1);
        }
    }

    private void ac() {
        if (this.var_byte_arr_e[8627 + this.var_int_q] == 2) {
            this.var_byte_arr_r[this.var_byte_ar] = 28;
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
        } else if (this.var_byte_arr_e[8627 + this.var_int_q] != 1 && this.var_byte_arr_e[8749 + this.var_int_q] < 12 && this.var_byte_arr_e[9115 + this.var_int_q] < this.var_byte_arr_f[this.var_byte_arr_e[8749 + this.var_int_q]]) {
            this.var_byte_arr_r[this.var_byte_ar] = 16;
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
        }
        if (this.var_byte_arr_e[8627 + this.var_int_q] == 1) {
            this.var_byte_arr_r[this.var_byte_ar] = 27;
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
        } else if (this.var_byte_arr_e[8505 + this.var_int_q] < this.var_byte_arr_e[8566 + this.var_int_q] && this.var_byte_arr_e[8749 + this.var_int_q] < 12) {
            this.var_byte_arr_r[this.var_byte_ar] = 26;
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
        }
        this.var_byte_arr_r[this.var_byte_ar] = 17;
        this.var_byte_ar = (byte)(this.var_byte_ar + 1);
    }

    private void ad() {
        if (!this.var_boolean_F) {
            if (this.var_byte_q != 3) {
                this.var_byte_arr_r[this.var_byte_ar] = 10;
                this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            }
            this.var_byte_arr_r[this.var_byte_ar] = this.var_boolean_N ? 15 : 12;
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            if (!this.var_boolean_N) {
                this.var_byte_arr_r[this.var_byte_ar] = this.var_boolean_L ? 14 : 11;
                this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            }
            this.var_byte_arr_r[this.var_byte_ar] = 13;
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            this.var_byte_arr_r[this.var_byte_ar] = (byte)(this.var_byte_aq + 23);
            this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            return;
        }
        this.var_int_aq = 1;
        while (this.var_int_aq <= 50) {
            if (this.var_byte_arr_e[1919 + this.var_int_aq] > 0 && this.var_byte_arr_e[1414 + this.var_int_aq] >= 12) {
                this.var_byte_arr_r[this.var_byte_ar] = (byte)(-this.var_int_aq);
                this.var_byte_ar = (byte)(this.var_byte_ar + 1);
            }
            ++this.var_int_aq;
        }
        if (!this.var_boolean_K) {
            this.var_int_aq = 1;
            while (this.var_int_aq <= 50) {
                if (this.var_byte_arr_e[1919 + this.var_int_aq] > 0 && this.var_byte_arr_e[1414 + this.var_int_aq] < 12) {
                    this.var_byte_arr_r[this.var_byte_ar] = (byte)(-this.var_int_aq);
                    this.var_byte_ar = (byte)(this.var_byte_ar + 1);
                }
                ++this.var_int_aq;
            }
        }
        this.a(false, false, false, true, true, false, false, false, false);
    }

    private void ae() {
        if (this.var_int_n > 1) {
            this.var_int_n = 0;
            return;
        }
        if (this.var_boolean_g && this.var_byte_j != 1) {
            if (this.var_byte_as >= 0) {
                if (this.var_byte_as > 0) {
                    this.var_byte_as = (byte)(this.var_byte_as - 1);
                }
                if (this.var_byte_as < this.aX) {
                    --this.aX;
                }
                this.var_boolean_V = false;
                this.ai();
                return;
            }
        } else if (this.var_boolean_h && this.var_byte_j != 1) {
            if (this.var_byte_as < this.var_byte_ar - 1) {
                if (this.var_byte_as >= this.aW - 1 && this.var_byte_as - this.aX == this.aW - 1) {
                    ++this.aX;
                }
                this.var_byte_as = (byte)(this.var_byte_as + 1);
                this.var_boolean_V = false;
                this.ai();
                return;
            }
        } else if (this.var_boolean_e && this.var_boolean_S) {
            if (this.var_boolean_arr_a[6]) {
                if (!this.var_boolean_Q) {
                    --this.var_int_y;
                    return;
                }
            } else if (this.var_byte_arr_s[this.var_byte_as] < this.var_byte_at) {
                byte by = this.var_byte_as;
                this.var_byte_arr_s[by] = (byte)(this.var_byte_arr_s[by] + 1);
                this.var_byte_arr_arr_arr_a[0][this.var_byte_au][this.var_byte_arr_r[this.var_byte_as]] = this.var_byte_arr_s[this.var_byte_as];
                return;
            }
        } else if (this.var_boolean_f && this.var_boolean_S) {
            if (this.var_boolean_arr_a[6]) {
                if (!this.var_boolean_R) {
                    ++this.var_int_y;
                    return;
                }
            } else if (this.var_byte_arr_s[this.var_byte_as] > 0) {
                byte by = this.var_byte_as;
                this.var_byte_arr_s[by] = (byte)(this.var_byte_arr_s[by] - 1);
                this.var_byte_arr_arr_arr_a[0][this.var_byte_au][this.var_byte_arr_r[this.var_byte_as]] = this.var_byte_arr_s[this.var_byte_as];
                return;
            }
        } else {
            if (this.var_boolean_i || var_boolean_l) {
                this.var_boolean_i = false;
                var_boolean_l = false;
                this.var_boolean_v = false;
                this.var_byte_E = (byte)4;
                if (this.var_byte_w == 4 && this.var_int_Y == 3) {
                    this.l(-2);
                    return;
                }
                if (this.var_int_Y == 4) {
                    return;
                }
                this.af();
                return;
            }
            if (var_boolean_m) {
                var_boolean_m = false;
                this.ah();
                return;
            }
        }
    }

    private void af() {
        if (this.var_byte_arr_r[this.var_byte_as] == 13) {
            this.aj();
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] < 0) {
            if (this.var_boolean_F) {
                if (this.var_byte_k == this.var_byte_l) {
                    if (this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + this.var_byte_k]][this.var_byte_arr_e[0 + this.var_byte_k]] != this.var_byte_k) {
                        this.a((int)this.var_byte_k, (int)this.var_byte_arr_e[4444 + this.var_byte_k], true, true);
                    }
                    if (this.var_boolean_K) {
                        this.var_short_arr_arr_a[0][17] = this.var_byte_k;
                        this.var_boolean_K = false;
                        this.var_b_a.b((int)this.var_byte_k);
                    }
                    this.d(this.var_byte_k);
                    this.var_boolean_F = false;
                }
                this.var_byte_k = this.var_byte_l;
            } else if (this.var_boolean_V) {
                this.a((int)this.var_byte_l, this.var_int_q, true, true);
                this.var_boolean_V = false;
            } else {
                this.var_boolean_V = true;
                this.var_boolean_P = true;
            }
            this.f(this.var_byte_arr_e[4646 + this.var_byte_l] < 0 || this.var_byte_arr_e[2828 + this.var_byte_l] == 92 || this.var_byte_arr_e[2828 + this.var_byte_l] == 106 ? this.var_byte_l : -this.var_byte_arr_e[4444 + this.var_byte_l], 0);
            return;
        }
        if (this.var_boolean_arr_a[6]) {
            this.aJ();
            this.l(0);
            this.var_int_s = this.var_byte_arr_a[this.var_short_arr_a[138] + 416 + this.var_byte_arr_r[this.var_byte_as]];
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 17) {
            this.l(3);
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 16 || this.var_byte_arr_r[this.var_byte_as] == 26) {
            this.b(this.var_int_q, this.var_byte_arr_r[this.var_byte_as] == 16);
            this.a(true, true, false, false);
            this.var_byte_w = 0;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 27) {
            this.var_byte_arr_e[8566 + this.var_int_q] = this.var_byte_arr_a[this.var_short_arr_a[138] + (7 + this.var_byte_arr_e[9115 + this.var_int_q] - 1) * 26 + this.var_byte_arr_e[8749 + this.var_int_q]];
            if (this.var_byte_arr_e[8505 + this.var_int_q] > this.var_byte_arr_e[8566 + this.var_int_q]) {
                this.var_byte_arr_e[8505 + this.var_int_q] = this.var_byte_arr_e[8566 + this.var_int_q];
            }
            if (this.var_byte_arr_e[8505 + this.var_int_q] > this.var_byte_arr_a[this.var_short_arr_a[138] + (7 + this.var_byte_arr_e[9115 + this.var_int_q] - 1) * 26 + this.var_byte_arr_e[8749 + this.var_int_q]]) {
                this.var_byte_arr_e[8505 + this.var_int_q] = this.var_byte_arr_a[this.var_short_arr_a[138] + (7 + this.var_byte_arr_e[9115 + this.var_int_q] - 1) * 26 + this.var_byte_arr_e[8749 + this.var_int_q]];
            }
            int n = 9054 + this.var_int_q;
            this.var_byte_arr_e[n] = (byte)(this.var_byte_arr_e[n] | 1);
            this.var_boolean_P = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 28) {
            int n = 9054 + this.var_int_q;
            this.var_byte_arr_e[n] = (byte)(this.var_byte_arr_e[n] | 1);
            this.var_boolean_P = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 10) {
            this.a(true, false, false, false, false, true, false, false, false);
            this.var_boolean_P = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 11) {
            this.var_boolean_M = true;
            this.l(2);
            this.var_int_s = 100;
            this.aJ();
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 14) {
            this.var_boolean_L = false;
            this.var_boolean_M = false;
            this.var_b_a.c();
            this.var_boolean_P = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 12) {
            this.var_boolean_O = true;
            this.l(2);
            this.var_int_s = 100;
            this.aJ();
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] == 15) {
            this.var_boolean_N = false;
            this.var_boolean_O = false;
            this.var_b_a.c();
            this.var_boolean_P = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] >= 23 && this.var_byte_arr_r[this.var_byte_as] <= 25) {
            this.var_byte_aq = (byte)(this.var_byte_aq + 1);
            if (this.var_byte_aq > 2) {
                this.var_byte_aq = 0;
            }
            this.var_boolean_P = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] >= 6 && this.var_byte_arr_r[this.var_byte_as] <= 8) {
            this.l(2);
            this.var_int_s = 20 + this.var_byte_arr_r[this.var_byte_as] - 6;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] < 6 || this.var_byte_arr_r[this.var_byte_as] == 29) {
            this.ag();
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] >= 19 && this.var_byte_w != 3) {
            this.l(this.var_byte_arr_r[this.var_byte_as] == 22 ? 2 : 1);
            this.var_int_s = (byte)(this.var_byte_arr_r[this.var_byte_as] - 19);
        }
    }

    private void ag() {
        if (this.var_byte_arr_e[8749 + this.var_int_q] == 6) {
            int n = 3;
            if (this.var_byte_arr_r[this.var_byte_as] == 29) {
                n = 2;
            }
            if (this.var_byte_k > 0) {
                this.var_byte_arr_e[3131 + this.var_byte_k] = (byte)(this.var_byte_y + this.var_byte_I);
                this.var_byte_arr_e[3232 + this.var_byte_k] = (byte)(this.var_byte_A + this.var_byte_K);
                this.var_byte_arr_e[2828 + this.var_byte_k] = (byte)(44 + this.var_byte_arr_r[this.var_byte_as]);
                this.var_byte_arr_e[6161 + this.var_byte_k] = n;
                this.a(false, true, false, true);
                this.var_byte_w = 1;
            } else if (this.var_byte_F != -1) {
                int n2 = 0;
                while (this.var_byte_arr_arr_a[this.var_byte_F][n2] > 0) {
                    this.var_byte_arr_e[3131 + this.var_byte_arr_arr_a[this.var_byte_F][n2]] = (byte)(this.var_byte_y + this.var_byte_I);
                    this.var_byte_arr_e[3232 + this.var_byte_arr_arr_a[this.var_byte_F][n2]] = (byte)(this.var_byte_A + this.var_byte_K);
                    this.var_byte_arr_e[2828 + this.var_byte_arr_arr_a[this.var_byte_F][n2]] = (byte)(44 + this.var_byte_arr_r[this.var_byte_as]);
                    this.var_byte_arr_e[6161 + this.var_byte_arr_arr_a[this.var_byte_F][n2]] = n;
                    ++n2;
                }
                this.a(true, true, false, false);
                this.var_byte_w = 1;
            } else {
                this.l(1);
                this.var_int_s = -this.var_byte_arr_r[this.var_byte_as] - 1;
            }
            this.var_byte_l = this.var_byte_k;
        }
    }

    private void ah() {
        if (this.var_boolean_K) {
            return;
        }
        this.var_boolean_P = false;
        if (this.var_byte_w == 4) {
            this.l(-1);
            return;
        }
        if (this.var_byte_k != 0) {
            this.var_byte_w = 1;
            this.var_byte_l = this.var_byte_k;
            this.a(false, true, false, true);
        } else if (this.var_byte_F != -1) {
            this.var_byte_w = 1;
            this.a(true, true, false, false);
        } else {
            this.var_byte_w = 0;
            this.a(true, true, false, false);
        }
        this.var_int_q = 0;
        this.var_boolean_F = false;
        this.i();
        this.var_boolean_V = false;
    }

    private void ai() {
        this.var_boolean_arr_b[2] = true;
        if (this.var_byte_ad == 6) {
            this.var_boolean_T = this.var_byte_as > 0;
            this.var_boolean_U = this.var_byte_as < this.var_byte_ar - 1;
        } else {
            this.var_boolean_T = this.aX > 0;
            boolean bl = this.var_boolean_U = this.aX + this.aW < this.var_byte_ar;
        }
        if (this.var_byte_arr_r[this.var_byte_as] < 0) {
            this.var_byte_l = -this.var_byte_arr_r[this.var_byte_as];
            this.a(false, false, this.var_boolean_arr_a[2], true, this.var_boolean_arr_a[5], false, false, false, false);
        } else if (this.var_boolean_arr_a[4]) {
            this.var_byte_l = 0;
            this.a(true, false, true, false);
        }
        this.var_boolean_arr_a[8] = false;
        this.var_boolean_arr_a[7] = false;
        if (this.var_byte_ad == 6 || this.var_byte_arr_r[this.var_byte_as] >= 6 && this.var_byte_arr_r[this.var_byte_as] <= 8 || this.var_byte_arr_r[this.var_byte_as] == 16) {
            this.var_boolean_arr_b[8] = true;
            this.var_boolean_arr_a[8] = true;
            return;
        }
        if (this.var_byte_arr_r[this.var_byte_as] >= 0 && this.var_byte_arr_r[this.var_byte_as] < 6) {
            this.var_boolean_arr_b[7] = true;
            this.var_boolean_arr_a[7] = true;
        }
    }

    private void aj() {
        this.var_boolean_F = true;
        this.var_byte_as = 0;
        this.aX = 0;
        this.var_byte_k = 0;
        while (this.var_byte_arr_e[1919 + this.var_byte_l] <= 0) {
            this.var_byte_l = (byte)(this.var_byte_l + 1);
        }
        this.var_boolean_P = true;
    }

    private void l(int n) {
        this.var_int_Y = n;
        if (this.var_int_Y > -1) {
            this.var_short_arr_d[4] = (short)(33 + this.var_int_Y);
            this.var_byte_arr_k[4] = 1;
            this.var_byte_x = this.var_byte_w;
            this.var_boolean_arr_c = new boolean[]{this.var_boolean_arr_a[0], this.var_boolean_arr_a[1], this.var_boolean_arr_a[2], this.var_boolean_arr_a[4], this.var_boolean_arr_a[5], this.var_boolean_arr_a[6], this.var_boolean_arr_a[7], this.var_boolean_arr_a[8], this.var_boolean_arr_a[9]};
            if (this.var_int_Y <= 5) {
                this.a(true, false, true, false);
            } else {
                this.a(this.var_boolean_arr_a[0], false, true, this.var_boolean_arr_a[4], this.var_boolean_arr_a[5], this.var_boolean_arr_a[6], this.var_boolean_arr_a[7], this.var_boolean_arr_a[8], this.var_boolean_arr_a[9]);
            }
            this.var_byte_w = (byte)(this.var_int_Y >= 3 ? 4 : 3);
            this.var_boolean_arr_b[2] = true;
        } else if (this.var_int_Y == -2) {
            this.c(this.var_int_q, true);
            this.var_short_arr_d[4] = 0;
        } else {
            this.var_byte_w = this.var_byte_x;
            this.a(this.var_boolean_arr_c[0], this.var_boolean_arr_c[1], this.var_boolean_arr_c[2], this.var_boolean_arr_c[3], this.var_boolean_arr_c[4], this.var_boolean_arr_c[5], this.var_boolean_arr_c[6], this.var_boolean_arr_c[7], this.var_boolean_arr_c[8]);
            this.var_short_arr_d[4] = 0;
            if (this.var_int_s == 100) {
                this.ah();
            } else {
                this.var_boolean_P = true;
            }
            this.var_boolean_M = false;
            this.var_boolean_O = false;
        }
        this.var_int_s = 0;
    }

    final void void_d(int n) {
        if (this.var_byte_w == 2 && n == this.var_int_q) {
            this.var_boolean_P = true;
        }
    }

    final void b(int n, boolean bl) {
        this.var_b_a.b((byte)n);
        byte by = this.var_byte_arr_e[8993 + n];
        while (by > 0) {
            this.a((int)by, n, false, false);
            by = this.var_byte_arr_e[4545 + by];
        }
        int n2 = this.var_byte_arr_e[8627 + n] = bl ? 1 : 2;
        if (bl) {
            this.var_byte_arr_e[8566 + n] = this.var_byte_arr_a[this.var_short_arr_a[138] + (7 + this.var_byte_arr_e[9115 + n]) * 26 + this.var_byte_arr_e[8749 + n]];
        }
    }

    private void ak() {
        try {
            this.al();
            if (this.var_byte_Q == 22 || this.var_byte_Q == 23) {
                this.am();
            } else if (var_boolean_m) {
                var_boolean_m = false;
                this.an();
            } else if ((this.var_boolean_i || var_boolean_l || this.var_boolean_j) && this.aR <= 0 && this.aP == 0 && (this.var_byte_Q < 28 || this.var_byte_Q == 32)) {
                this.var_boolean_j = false;
                this.var_boolean_i = false;
                var_boolean_l = false;
                this.var_boolean_v = false;
                this.var_byte_E = (byte)4;
                if (this.var_byte_Q == 32) {
                    return;
                }
                this.ao();
            } else if (this.var_boolean_e) {
                this.aB();
            } else if (this.var_boolean_f) {
                this.aC();
            }
            this.aD();
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void al() {
        if (this.var_byte_Q == 27 && (this.var_boolean_i || var_boolean_l)) {
            this.var_boolean_i = false;
            var_boolean_l = false;
            this.var_boolean_v = false;
            this.var_byte_E = (byte)4;
            this.i();
            this.var_byte_Q = this.var_byte_R;
            this.var_byte_R = this.var_byte_S;
            this.var_boolean_H = true;
            this.var_int_v = this.var_int_x;
            if (this.var_byte_e > 0) {
                this.aQ();
            }
        }
    }

    private void am() {
        this.var_byte_Q = this.var_byte_R;
        this.var_boolean_H = true;
        if (this.var_byte_T == 0) {
            this.g(this.var_byte_q);
            if (this.var_byte_Q == 18) {
                this.a(true, true, false, false);
                this.var_byte_m = 0;
                this.var_byte_Q = (byte)28;
                this.void_b((int)this.var_byte_arr_a[this.var_short_arr_a[303] + this.var_byte_q]);
                this.var_byte_Q = (byte)18;
            }
            return;
        }
        if (this.var_byte_T == 1) {
            if (this.var_byte_u > 0 && this.var_byte_u < 41) {
                this.var_byte_t = (byte)(this.var_byte_t + 1);
            }
            if (!this.boolean_e(this.var_byte_q < 7 ? 1 : 2)) {
                if (this.var_byte_q < 7) {
                    this.var_byte_t = (byte)-1;
                } else {
                    this.var_boolean_W = false;
                }
                this.var_int_v = 66;
            } else {
                this.var_int_v = 67;
                this.boolean_e(0);
            }
            this.var_byte_R = (byte)(this.var_byte_q < 7 ? (this.var_byte_t > -1 ? 10 : 11) : (this.var_boolean_W ? 10 : 11));
            this.var_boolean_A = true;
            this.var_byte_v = 1;
            this.n();
            this.u();
            this.var_byte_v = 0;
            return;
        }
        if (this.var_byte_T == 2 && !this.boolean_d(this.var_byte_q < 7 ? 1 : 2)) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_T = 0;
            this.var_byte_Q = (byte)23;
        }
    }

    private void an() {
        if (this.var_byte_Q == 32) {
            this.var_byte_Q = this.var_byte_U;
            this.var_boolean_H = true;
            return;
        }
        if (this.var_byte_arr_a[this.var_short_arr_a[153] + 29 + this.var_byte_Q] == 1) {
            if (this.var_byte_Q == 25) {
                this.l(-1);
                this.var_boolean_P = false;
                this.var_boolean_I = false;
            }
            this.var_byte_Q = (byte)28;
        } else if (this.var_byte_Q == this.var_byte_U) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_Q = (byte)30;
        } else if (this.var_byte_Q == 20) {
            if (this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + 20] == 0) {
                this.var_byte_z = this.var_byte_y;
                this.var_byte_B = this.var_byte_A;
                this.var_byte_J = this.var_byte_I;
                this.var_byte_L = this.var_byte_K;
                this.var_byte_Q = (byte)28;
                this.a(this.var_boolean_arr_d[0], this.var_boolean_arr_d[1], this.var_boolean_arr_d[2], this.var_boolean_arr_d[3], this.var_boolean_arr_d[4], this.var_boolean_arr_d[5], this.var_boolean_arr_d[6], this.var_boolean_arr_d[7], this.var_boolean_arr_d[8]);
            }
        } else if (this.var_byte_Q == 16 && this.var_int_v == 60) {
            this.var_byte_T = 0;
            this.var_byte_Q = (byte)22;
            this.var_int_v = 69;
            this.var_byte_R = (byte)18;
        } else if (this.var_byte_Q == 2) {
            this.var_byte_Q = this.var_byte_U;
            this.var_int_Z = 0;
        } else if (this.var_byte_Q == this.var_byte_V || this.var_byte_Q == 9) {
            this.var_byte_Q = (byte)13;
            this.var_int_Z = 1;
        } else if (this.var_byte_Q == 14) {
            this.void_b();
        } else if (this.var_byte_arr_a[this.var_short_arr_a[153] + 58 + this.var_byte_Q] == 1) {
            if (this.var_byte_Q == 12) {
                this.boolean_e(0);
            }
            this.var_byte_Q = this.var_byte_R;
            this.var_byte_R = this.var_byte_S;
            this.var_int_Z = this.var_int_aa;
            this.var_byte_m = 0;
            this.var_boolean_ac = true;
        } else if (this.var_byte_arr_a[this.var_short_arr_a[153] + 58 + this.var_byte_Q] > 1) {
            this.var_byte_Q = this.var_byte_arr_a[this.var_short_arr_a[153] + 58 + this.var_byte_Q];
            this.var_byte_R = this.var_byte_S;
            this.var_int_Z = this.var_int_aa;
            this.var_byte_m = 0;
        }
        this.var_boolean_H = true;
    }

    private void ao() {
        byte by = this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + this.var_byte_Q] + this.var_int_Z];
        if (this.var_boolean_af) {
            this.var_byte_V = (byte)8;
            this.var_byte_r = (byte)4;
        }
        if (this.var_byte_arr_a[this.var_short_arr_a[153] + 87 + this.var_byte_Q] == 1) {
            this.var_byte_Q = this.var_byte_R;
        } else if (this.var_byte_Q == 19) {
            this.var_byte_z = this.var_byte_y;
            this.var_byte_B = this.var_byte_A;
            this.var_byte_J = this.var_byte_I;
            this.var_byte_L = this.var_byte_K;
            this.var_byte_Q = (byte)28;
        } else if (this.var_byte_Q == 20) {
            this.ap();
        } else if (this.var_byte_Q == 18 || this.var_byte_Q == 17) {
            this.void_b(-1);
        } else if (this.var_byte_Q == 15) {
            this.aq();
        } else if (this.var_byte_Q == 16) {
            this.ar();
        } else if (this.var_byte_Q == 12) {
            this.as();
        } else if (this.var_byte_Q == 13) {
            this.at();
        } else if (this.var_byte_Q == this.var_byte_V) {
            this.au();
        } else if (this.var_byte_Q == 9) {
            this.var_byte_q = this.var_byte_arr_a[this.var_short_arr_a[249] + by - 25];
            this.var_byte_T = 0;
            this.var_byte_Q = (byte)22;
            this.var_int_v = 69;
            this.var_byte_R = (byte)29;
        } else if (this.var_byte_Q == 24) {
            this.av();
        } else if (this.var_byte_Q == 25) {
            ++this.var_int_Z;
            if (this.var_int_Z >= this.var_byte_arr_a[this.var_short_arr_a[307] + this.var_byte_m]) {
                this.var_int_Z = 0;
            }
            this.var_short_arr_d[4] = (short)(33 + this.var_byte_arr_a[this.var_short_arr_a[305] + this.var_byte_arr_a[this.var_short_arr_a[306] + this.var_byte_m] + this.var_int_Z]);
            this.var_boolean_arr_b[2] = true;
        } else if (this.var_byte_Q == 14) {
            var_byte_a = (byte)this.var_int_Z;
            this.var_c_a.b(0);
            this.var_c_a.b(1);
            this.var_byte_Q = (byte)16;
        } else if (by == 6) {
            this.var_byte_Q = (byte)28;
        } else if (by == 0) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_Q = (byte)2;
            this.var_int_aa = this.var_int_Z;
        } else if (by == 12) {
            this.var_byte_q = 0;
            this.var_byte_R = this.var_byte_Q;
            if (this.var_byte_s > -1) {
                this.var_byte_Q = (byte)3;
            } else {
                this.var_byte_Q = (byte)13;
                this.var_int_Z = 1;
            }
            this.var_int_aa = 0;
        } else if (by == 13) {
            this.aw();
        } else if (by == 10) {
            this.ax();
        } else if (by == 11) {
            this.var_byte_Q = (byte)31;
        } else if (by == 9) {
            this.ay();
        } else if (by == 5) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_Q = (byte)30;
            this.var_int_aa = this.var_int_Z;
        } else if (by == 1) {
            this.az();
            this.var_byte_arr_a[this.var_short_arr_a[153] + 116 + this.var_byte_Q] = 4;
            this.var_byte_m = 1;
            this.var_c_a.a(70);
        } else if (by == 3) {
            this.az();
            this.var_byte_arr_a[this.var_short_arr_a[153] + 116 + this.var_byte_Q] = 2;
            this.var_byte_m = 0;
            this.var_c_a.a(74);
        } else if (by == 2) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_Q = (byte)12;
            this.var_int_aa = this.var_int_Z;
            this.var_int_Z = 1;
            this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + 12] + 1] = (byte)(17 + this.var_byte_e / 2);
            this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + 12] + 3] = (byte)(17 + this.var_int_l);
        } else if (by == 4) {
            this.var_byte_Q = (byte)32;
        } else if (by == 7) {
            this.aA();
        } else if (by == 8) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_Q = (byte)16;
            this.var_int_aa = this.var_int_Z;
            this.var_int_v = 63;
        }
        this.var_boolean_H = true;
    }

    private void ap() {
        if (this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + 20] == 0) {
            if (this.var_byte_ap == 14 || this.var_byte_ap == 15) {
                this.void_e((int)this.var_byte_am);
                this.f((int)this.var_byte_am);
                this.var_b_a.var_int_v = this.var_byte_am;
                this.var_b_a.var_int_u = 0;
                if (this.var_b_a.a(this.var_byte_ap == 14 ? 4 : 2)) {
                    this.var_byte_arr_e[6161 + this.var_byte_am] = 2;
                }
            } else {
                this.f(this.var_byte_an, 0);
            }
            this.aJ();
            if (this.var_byte_w == 3) {
                this.l(-1);
                this.ah();
            } else {
                this.a(this.var_boolean_arr_d[0], this.var_boolean_arr_d[1], this.var_boolean_arr_d[2], this.var_boolean_arr_d[3], this.var_boolean_arr_d[4], this.var_boolean_arr_d[5], this.var_boolean_arr_d[6], this.var_boolean_arr_d[7], this.var_boolean_arr_d[8]);
            }
        } else {
            this.a(this.var_boolean_arr_d[0], this.var_boolean_arr_d[1], this.var_boolean_arr_d[2], this.var_boolean_arr_d[3], this.var_boolean_arr_d[4], this.var_boolean_arr_d[5], this.var_boolean_arr_d[6], this.var_boolean_arr_d[7], this.var_boolean_arr_d[8]);
        }
        this.var_byte_z = this.var_byte_y;
        this.var_byte_B = this.var_byte_A;
        this.var_byte_J = this.var_byte_I;
        this.var_byte_L = this.var_byte_K;
        this.var_byte_Q = (byte)28;
        if (this.var_boolean_K) {
            this.var_int_o = 0;
            this.aJ();
            this.l(-1);
            this.var_boolean_P = false;
            this.a(true, false, false, false, true, false, false, false, false);
            this.var_byte_w = (byte)2;
            this.var_boolean_arr_b[4] = true;
            this.Z();
            this.aj();
        }
    }

    private void aq() {
        if (this.var_byte_m >= 4) {
            return;
        }
        if (this.var_byte_m > 0) {
            if (this.var_byte_m == 3) {
                this.var_byte_arr_a[this.var_short_arr_a[153] + 116 + this.var_byte_Q] = 2;
            }
            this.var_c_a.a(70 + this.var_byte_m);
            this.var_int_v = 71;
            this.var_byte_m = (byte)(this.var_byte_m + 1);
            return;
        }
        if (this.var_byte_m == -1) {
            if (this.var_byte_u == 41) {
                this.aM();
                if (this.var_byte_q < 5) {
                    this.var_byte_q = (byte)(this.var_byte_q + 1);
                    this.var_byte_T = 0;
                    this.var_byte_Q = (byte)23;
                    this.var_int_v = 69;
                    this.var_byte_R = (byte)18;
                    this.var_byte_s = this.var_byte_arr_a[this.var_short_arr_a[248] + this.var_byte_q];
                    if (this.var_byte_r < this.var_byte_s) {
                        this.var_byte_r = this.var_byte_s;
                    }
                    this.var_byte_V = (byte)(4 + this.var_byte_r);
                    this.boolean_e(0);
                } else if (this.var_byte_q == 6) {
                    this.var_int_c = -1;
                    this.var_byte_Q = this.var_byte_U;
                    this.void_b(59);
                    this.var_byte_q = (byte)(this.var_byte_q + 1);
                    this.var_byte_Q = (byte)18;
                } else {
                    this.var_int_c = -1;
                    this.var_byte_Q = this.var_byte_U;
                }
                this.var_int_Z = 0;
                return;
            }
            if (this.var_byte_q == 1 || this.var_byte_q == 6) {
                this.var_byte_q = (byte)(this.var_byte_q - 1);
            }
            this.aM();
            this.var_byte_R = this.var_byte_U;
            this.var_byte_Q = (byte)16;
            this.var_int_v = 58;
            this.var_int_Z = 0;
            this.var_int_c = -1;
        }
    }

    private void ar() {
        if (this.var_int_v == 68) {
            this.void_b();
            return;
        }
        if (this.var_int_v == 65) {
            this.aM();
            this.var_byte_Q = this.var_byte_U;
            this.var_int_Z = 0;
            this.var_int_c = -1;
            this.var_int_g = 0;
            return;
        }
        if (this.var_int_v == 58) {
            this.var_byte_T = 0;
            this.var_byte_Q = (byte)22;
            this.var_int_v = 69;
            this.var_byte_R = (byte)(this.var_byte_q < 7 ? 18 : 29);
            return;
        }
        if (this.var_int_v == 59) {
            this.var_byte_e = (byte)2;
            this.var_boolean_ac = true;
            this.aQ();
            this.var_byte_R = this.var_byte_Q = this.var_byte_U;
            return;
        }
        if (this.var_int_v == 64) {
            this.var_byte_T = 1;
            this.var_byte_Q = (byte)22;
            this.var_int_v = 69;
            this.var_byte_R = (byte)21;
            return;
        }
        if (this.var_int_v == 63) {
            this.var_byte_Q = (byte)31;
            return;
        }
        if (this.var_int_v == 60) {
            this.var_byte_p = 1;
            this.var_byte_T = 0;
            this.var_byte_Q = (byte)22;
            this.var_int_v = 69;
            this.var_byte_R = (byte)18;
            return;
        }
        if (this.var_int_v == 62) {
            this.var_byte_s = (byte)-1;
            this.var_byte_t = (byte)-2;
            this.var_byte_Q = (byte)13;
            this.var_byte_R = (byte)2;
            this.var_int_Z = 1;
            this.boolean_e(0);
        }
    }

    private void as() {
        if (this.var_int_Z == 1) {
            this.var_byte_e = (byte)(this.var_byte_e == 0 ? 2 : 0);
            this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + 12] + 1] = (byte)(17 + this.var_byte_e / 2);
            if (this.var_a_a != null) {
                this.var_a_a.a(this.var_byte_e);
                return;
            }
            this.aR();
            this.aQ();
            return;
        }
        if (this.var_int_Z == 3) {
            this.var_int_l = this.var_int_l == 0 ? 1 : 0;
            this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + 12] + 3] = (byte)(17 + this.var_int_l);
        }
    }

    private void at() {
        this.var_byte_b = (byte)(this.var_int_Z / 2);
        if (this.var_byte_q >= 7) {
            this.var_byte_Q = (byte)9;
            this.var_byte_d = this.var_byte_b;
        } else {
            if (this.var_byte_r == 0) {
                this.var_byte_Q = (byte)16;
                this.var_int_v = 60;
                this.var_byte_p = 0;
                this.var_byte_s = 0;
            } else {
                this.var_byte_Q = this.var_byte_V;
            }
            this.var_byte_c = this.var_byte_b;
            this.boolean_e(0);
        }
        this.var_int_Z = 0;
    }

    private void au() {
        this.var_byte_q = this.var_byte_arr_a[this.var_short_arr_a[249] + this.var_byte_arr_a[this.var_short_arr_a[151] + this.var_byte_arr_a[this.var_short_arr_a[152] + this.var_byte_Q] + this.var_int_Z] - 25];
        this.var_byte_s = this.var_byte_arr_a[this.var_short_arr_a[248] + this.var_byte_q];
        if (this.var_byte_q == 0) {
            this.var_byte_Q = (byte)16;
            this.var_int_v = 60;
            this.var_byte_p = 0;
        } else {
            this.var_byte_T = 0;
            this.var_byte_Q = (byte)22;
            this.var_int_v = 69;
        }
        this.var_byte_R = (byte)18;
        this.boolean_e(0);
    }

    private void av() {
        this.var_byte_Q = (byte)15;
        this.var_int_Z = 0;
        this.var_byte_arr_a[this.var_short_arr_a[153] + 116 + this.var_byte_Q] = 0;
        this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + this.var_byte_Q] = 2;
        this.var_byte_arr_a[this.var_short_arr_a[153] + 58 + this.var_byte_Q] = 0;
        this.var_c_a.a(75);
        this.var_int_v = 71;
        this.var_byte_m = (byte)-1;
        for (int i = 0; i < 2; ++i) {
            for (int j = 0; j < 5; ++j) {
                short[] sArray = this.var_short_arr_arr_a[i];
                sArray[24] = (short)(sArray[24] + this.var_short_arr_arr_a[i][19 + j] * this.var_byte_arr_a[this.var_short_arr_a[112] + j] / 10);
            }
        }
    }

    private void aw() {
        this.var_byte_q = (byte)7;
        this.var_byte_R = this.var_byte_Q;
        if (this.var_boolean_W) {
            this.var_byte_Q = (byte)3;
            this.var_int_Z = 0;
        } else if (this.var_byte_r > 0 || this.var_boolean_af) {
            this.var_byte_Q = (byte)13;
            this.var_int_Z = 1;
        } else {
            this.var_int_v = 70;
            this.var_byte_Q = (byte)21;
            this.var_int_Z = 0;
        }
        this.var_int_aa = 1;
    }

    private void ax() {
        this.var_int_Z = 0;
        this.var_byte_R = this.var_byte_Q;
        if (this.var_byte_q < 7) {
            if (this.var_byte_s > -1) {
                this.var_byte_Q = (byte)16;
                this.var_int_v = 62;
                return;
            }
            if (this.var_byte_Q == 4) {
                this.var_byte_Q = (byte)16;
                this.var_int_v = 60;
                this.var_byte_p = 0;
                return;
            }
            this.var_byte_Q = this.var_byte_V;
            return;
        }
        this.var_byte_Q = (byte)13;
        this.var_int_aa = 1;
        this.var_int_Z = 1;
    }

    private void ay() {
        if (!this.var_boolean_X) {
            this.var_byte_R = this.var_byte_Q;
            this.var_byte_Q = (byte)16;
            this.var_int_v = 65;
            return;
        }
        this.aM();
        this.var_byte_Q = this.var_byte_U;
        this.var_int_Z = 0;
        this.var_int_c = -1;
        this.var_int_g = 0;
    }

    private void az() {
        this.var_byte_R = this.var_byte_Q;
        this.var_byte_Q = (byte)15;
        this.var_int_aa = this.var_int_Z;
        this.var_int_v = 71;
        this.var_byte_arr_a[this.var_short_arr_a[153] + 145 + this.var_byte_Q] = 0;
        this.var_byte_arr_a[this.var_short_arr_a[153] + 58 + this.var_byte_Q] = 1;
    }

    private void aA() {
        this.var_byte_R = this.var_byte_Q;
        this.var_int_aa = this.var_int_Z;
        this.var_boolean_X = true;
        if (this.var_byte_q < 7 ? this.var_byte_t > -1 : this.var_boolean_W) {
            this.var_byte_Q = (byte)16;
            this.var_int_v = 64;
            return;
        }
        this.var_byte_T = 1;
        this.var_byte_Q = (byte)22;
        this.var_int_v = 69;
        this.var_byte_R = (byte)21;
    }

    private void aB() {
        if (this.var_byte_arr_a[this.var_short_arr_a[153] + 174 + this.var_byte_Q] == 1) {
            if (!this.var_boolean_Q) {
                --this.var_int_y;
                return;
            }
        } else {
            if (this.var_byte_Q == 12) {
                --this.var_int_Z;
            } else if (this.var_byte_Q == 13 && this.var_int_Z == 1) {
                --this.var_int_Z;
            }
            this.var_int_Z = this.var_int_Z > 0 ? this.var_int_Z - 1 : this.var_int_ab - 1;
        }
    }

    private void aC() {
        if (this.var_byte_arr_a[this.var_short_arr_a[153] + 174 + this.var_byte_Q] == 1) {
            if (!this.var_boolean_R) {
                ++this.var_int_y;
                return;
            }
        } else {
            int n = this.var_int_Z = this.var_int_Z < this.var_int_ab - 1 ? this.var_int_Z + 1 : 0;
            if (this.var_byte_Q == 12) {
                this.var_int_Z = this.var_int_Z / 2 * 2 + 1;
                return;
            }
            if (this.var_byte_Q == 13 && this.var_int_Z == 0) {
                ++this.var_int_Z;
            }
        }
    }

    private void aD() {
        if (this.var_byte_Q == 31) {
            if (this.var_byte_t >= this.var_byte_s || this.var_byte_q >= 7) {
                this.var_byte_T = (byte)2;
                this.var_byte_Q = (byte)22;
                this.var_int_v = 69;
                this.var_byte_R = (byte)28;
            } else {
                this.var_byte_q = this.var_byte_s;
                if (this.var_byte_q >= 1) {
                    this.var_byte_q = (byte)(this.var_byte_q + 1);
                }
                this.var_byte_T = 0;
                this.var_byte_Q = (byte)22;
                this.var_int_v = 69;
                this.var_byte_R = (byte)18;
            }
            this.var_byte_b = this.var_byte_c;
        }
        if (this.var_byte_Q == 28) {
            this.a(this.var_boolean_arr_a[0], this.var_boolean_arr_a[1], this.var_boolean_arr_a[2], this.var_boolean_arr_a[4], this.var_boolean_arr_a[5], this.var_boolean_arr_a[6], this.var_boolean_arr_a[7], this.var_boolean_arr_a[8], this.var_boolean_arr_a[9]);
            this.var_boolean_c = false;
            this.var_byte_y = this.var_byte_z;
            this.var_byte_A = this.var_byte_B;
            this.var_byte_I = this.var_byte_J;
            this.var_byte_K = this.var_byte_L;
            this.var_boolean_A = true;
            this.var_byte_v = 1;
            this.i();
            return;
        }
        if (this.var_byte_Q == 19) {
            this.Y();
            this.E();
            return;
        }
        if (this.var_byte_Q == 30) {
            this.var_byte_Q = (byte)16;
            this.var_int_v = 68;
            this.var_boolean_H = true;
            return;
        }
        if (this.var_byte_Q == 29) {
            this.a(true, true, false, false);
            this.var_boolean_A = true;
            this.var_byte_Q = (byte)28;
        }
    }

    private void aE() {
        ++this.var_int_F;
        if (this.var_int_F > 4) {
            this.var_boolean_u = true;
            this.var_boolean_t = false;
            this.var_int_F = 0;
            this.var_byte_F = (byte)4;
            this.var_byte_k = 0;
            this.a(true, true, false, false);
            this.var_int_q = 0;
            this.var_int_G = this.var_byte_y + this.var_byte_I;
            this.var_int_H = this.var_byte_A + this.var_byte_K;
            this.aI();
        }
    }

    private void aF() {
        this.var_boolean_u = false;
        this.var_boolean_t = false;
        this.aI();
        this.var_int_L = 0;
        this.var_int_K = this.var_int_C + 1;
        while (this.var_int_K <= this.var_int_C + this.var_int_E) {
            this.var_int_J = this.var_int_B + 1;
            while (this.var_int_J <= this.var_int_B + this.var_int_D) {
                this.var_byte_H = this.var_byte_arr_arr_c[this.var_int_K][this.var_int_J];
                if (this.var_byte_H >= 1 && this.var_byte_H <= 50 && this.var_byte_arr_e[1919 + this.var_byte_H] > 0) {
                    if (this.var_int_L < 50) {
                        this.var_byte_arr_arr_a[4][this.var_int_L] = this.var_byte_H;
                        this.var_byte_arr_e[909 + this.var_byte_H] = 4;
                    }
                    ++this.var_int_L;
                }
                ++this.var_int_J;
            }
            ++this.var_int_K;
        }
        if (this.var_byte_arr_arr_a[4][0] == 0) {
            this.var_byte_w = 0;
            this.var_byte_k = 0;
            this.var_byte_F = (byte)-1;
        } else if (this.var_byte_arr_arr_a[4][1] == 0) {
            this.var_byte_arr_e[909 + this.var_byte_arr_arr_a[4][0]] = 0;
            this.d(this.var_byte_arr_arr_a[4][0]);
            this.var_byte_arr_arr_a[4][0] = 0;
            this.var_byte_F = (byte)-1;
        } else {
            this.var_byte_F = (byte)4;
            this.var_byte_w = 1;
            this.var_int_M = this.var_int_L;
            if (this.var_int_M > 50) {
                this.var_int_M = 50;
            }
        }
        this.var_int_E = 0;
        this.var_int_D = 0;
        this.var_int_C = 0;
        this.var_int_B = 0;
    }

    private void aG() {
        this.var_boolean_w = false;
        this.var_int_I = 0;
        switch (this.var_byte_i) {
            case 7: {
                this.var_byte_G = (byte)2;
                break;
            }
            case 9: {
                this.var_byte_G = (byte)3;
                break;
            }
            default: {
                return;
            }
        }
        this.var_int_L = 0;
        while (this.var_int_L < 50) {
            this.var_byte_arr_arr_a[0][this.var_int_L] = this.var_byte_H = this.var_byte_F != -1 ? this.var_byte_arr_arr_a[this.var_byte_F][this.var_int_L] : (this.var_int_L == 0 ? this.var_byte_k : (byte)0);
            this.var_byte_arr_e[909 + this.var_byte_arr_arr_a[this.var_byte_G][this.var_int_L]] = 0;
            this.var_byte_arr_arr_a[this.var_byte_G][this.var_int_L] = 0;
            ++this.var_int_L;
        }
        this.var_int_L = 0;
        while (this.var_int_L < 50) {
            this.var_byte_H = this.var_byte_arr_arr_a[0][this.var_int_L];
            if (this.var_byte_H != 0) {
                this.void_e((int)this.var_byte_H);
                this.var_byte_arr_arr_a[this.var_byte_G][this.var_int_L] = this.var_byte_H;
                this.var_byte_arr_e[909 + this.var_byte_H] = this.var_byte_G;
            }
            ++this.var_int_L;
        }
        this.var_byte_w = 1;
        this.var_byte_F = this.var_byte_G;
        this.var_byte_k = 0;
        this.a(true, true, false, false);
    }

    private void aH() {
        this.var_boolean_w = false;
        this.var_int_I = 0;
        switch (this.var_byte_i) {
            case 7: {
                this.var_byte_G = (byte)2;
                break;
            }
            case 9: {
                this.var_byte_G = (byte)3;
                break;
            }
            default: {
                return;
            }
        }
        if (this.var_byte_F == this.var_byte_G) {
            this.f(this.var_byte_arr_arr_a[this.var_byte_F][0], 0);
            return;
        }
        if (this.var_byte_arr_arr_a[this.var_byte_G][0] != 0) {
            this.var_byte_F = this.var_byte_G;
            this.aI();
            this.var_int_M = 0;
            this.var_int_L = 0;
            while (this.var_int_L < 50) {
                if (this.var_byte_arr_arr_a[this.var_byte_F][this.var_int_L] != 0) {
                    this.var_byte_arr_e[909 + this.var_byte_arr_arr_a[this.var_byte_F][this.var_int_L]] = this.var_byte_F;
                    ++this.var_int_M;
                }
                ++this.var_int_L;
            }
            this.var_byte_w = 1;
            this.var_byte_k = 0;
            this.a(true, true, false, false);
        }
    }

    final void void_e(int n) {
        for (int i = 0; i < 5; ++i) {
            int n2 = i < 4 ? this.var_byte_arr_a[this.var_short_arr_a[125] + i] : 4;
            if (n2 == -1) continue;
            for (int j = 0; j < 50; ++j) {
                if (this.var_byte_arr_arr_a[n2][j] != n) continue;
                while (j < 50) {
                    this.var_byte_arr_arr_a[n2][j] = j < 49 ? this.var_byte_arr_arr_a[n2][j + 1] : (byte)0;
                    ++j;
                }
                if (this.var_byte_arr_arr_a[n2][0] == 0 && this.var_byte_F == this.var_byte_arr_e[909 + n]) {
                    if (this.var_byte_w == 1) {
                        this.var_byte_w = 0;
                    }
                    this.var_byte_F = (byte)-1;
                }
                this.var_byte_arr_e[909 + n] = 0;
                return;
            }
        }
    }

    private void aI() {
        for (int i = 0; i < 50; ++i) {
            if (this.var_byte_arr_arr_a[4][i] == 0) continue;
            this.var_byte_arr_e[909 + this.var_byte_arr_arr_a[4][i]] = 0;
            this.var_byte_arr_arr_a[4][i] = 0;
        }
    }

    private void aJ() {
        if (this.var_boolean_u) {
            this.var_boolean_u = false;
            this.var_byte_F = (byte)-1;
            this.var_byte_k = 0;
            this.var_int_E = 0;
            this.var_int_D = 0;
            this.var_int_C = 0;
            this.var_int_B = 0;
        }
    }

    private void aK() {
        this.var_byte_y = this.var_byte_C;
        this.var_byte_A = this.var_byte_D;
        while (this.var_byte_I < 0) {
            this.var_byte_I = (byte)(this.var_byte_I + 1);
        }
        while (this.var_byte_K < 0 && !this.var_boolean_s) {
            this.var_byte_K = (byte)(this.var_byte_K + 1);
        }
        while (this.var_byte_I + this.var_byte_O > this.var_short_c - 1) {
            this.var_byte_I = (byte)(this.var_byte_I - 1);
        }
        while (this.var_byte_K + this.var_byte_P >= this.var_short_d - 1) {
            this.var_byte_K = (byte)(this.var_byte_K - 1);
        }
    }

    private void aL() {
        if (this.var_boolean_w) {
            ++this.var_int_I;
            if (this.var_int_I > 10) {
                this.var_boolean_w = false;
                this.var_int_I = 0;
            }
        }
    }

    private static byte byte_a(int n) {
        if (n >= 1 && n <= 50) {
            return 0;
        }
        if (n >= 51 && n <= 100) {
            return 1;
        }
        return 2;
    }

    final byte a(byte by, byte by2, byte by3, byte by4, byte by5) {
        byte by6 = (byte)(1 + by * 50);
        byte by7 = 0;
        while (this.var_byte_arr_e[1919 + by6 + by7] != 0) {
            by7 = (byte)(by7 + 1);
        }
        if (by7 >= 50) {
            return -1;
        }
        by7 = (byte)(by7 + by6);
        if (this.var_boolean_F) {
            this.var_boolean_P = true;
        }
        byte by8 = by2;
        this.var_byte_arr_e[3131 + by7] = by8;
        this.var_byte_arr_e[6262 + by7] = by8;
        this.var_byte_arr_e[0 + by7] = by8;
        byte by9 = by3;
        this.var_byte_arr_e[3232 + by7] = by9;
        this.var_byte_arr_e[6363 + by7] = by9;
        this.var_byte_arr_e[101 + by7] = by9;
        this.var_byte_arr_e[303 + by7] = 0;
        this.var_byte_arr_e[202 + by7] = 0;
        this.var_byte_arr_e[808 + by7] = 0;
        this.var_byte_arr_e[909 + by7] = 0;
        this.var_byte_arr_e[1111 + by7] = 0;
        this.var_byte_arr_e[4949 + by7] = (byte)(4 + (by5 & 7));
        this.var_byte_arr_e[606 + by7] = 3;
        this.var_byte_arr_e[1313 + by7] = 0;
        this.var_byte_arr_e[1414 + by7] = by4;
        this.var_byte_arr_e[1616 + by7] = (byte)((by5 & 7) * 2 + this.int_a(255, 2));
        this.var_byte_arr_e[1717 + by7] = (byte)((by5 & 7) * 2 + this.int_a(255, 2));
        this.var_byte_arr_e[1818 + by7] = (byte)(3 + (by5 & 7));
        this.var_byte_arr_e[2020 + by7] = (byte)(50 + 25 * (1 - by) + this.int_a(255, 25));
        this.var_byte_arr_e[2121 + by7] = (byte)(50 + 25 * (1 - by) + this.int_a(255, 25));
        this.var_byte_arr_e[505 + by7] = (byte)(50 + 25 * (1 - by) + this.int_a(255, 25));
        int n = (by5 & 0x20) != 0 ? 3 : 0;
        int n2 = this.int_a(255, 3);
        int n3 = this.int_a(255, 3);
        this.var_byte_arr_e[6969 + by7] = (byte)(n2 == 0 ? 2 + this.int_a(255, 2 + n) : 1);
        this.var_byte_arr_e[7070 + by7] = (byte)(n2 == 1 ? 2 + this.int_a(255, 2 + n) : 1);
        this.var_byte_arr_e[7272 + by7] = (byte)(n2 == 2 ? 2 + this.int_a(255, 2 + n) : 1);
        this.var_byte_arr_e[7171 + by7] = (byte)(n3 == 0 ? 2 + this.int_a(255, 2 + n) : 1);
        this.var_byte_arr_e[7373 + by7] = (byte)(n3 == 1 ? 2 + by + this.int_a(255, 2 + n) : 1 + by);
        this.var_byte_arr_e[7474 + by7] = (byte)(n3 == 2 ? 2 + this.int_a(255, 2 + n) : 1);
        this.var_byte_arr_e[7575 + by7] = (byte)(1 + (by5 >> 3 & 3) * 3 + this.int_a(255, 3));
        this.var_byte_arr_e[6464 + by7] = 69;
        this.var_byte_arr_e[3434 + by7] = -1;
        this.var_byte_arr_e[3535 + by7] = 0;
        this.var_byte_arr_e[3636 + by7] = 0;
        this.var_byte_arr_e[3737 + by7] = (byte)(2 + this.int_a(255, 2));
        this.var_byte_arr_e[3838 + by7] = by7;
        this.var_byte_arr_e[4545 + by7] = 0;
        this.var_byte_arr_e[4646 + by7] = -1;
        this.var_byte_arr_e[4747 + by7] = by7;
        this.var_byte_arr_e[4848 + by7] = 0;
        int n4 = 0;
        int n5 = 0;
        n4 = this.int_a(255, 3);
        n5 = this.int_a(15, 4);
        this.var_byte_arr_e[5151 + by7] = (byte)(n5 << 2 | n4);
        if ((this.var_short_arr_arr_a[by][12] <= this.var_short_arr_arr_a[by][13] || this.var_byte_aw == 0) && this.var_byte_aw != 1) {
            this.var_byte_arr_e[1515 + by7] = 0;
            short[] sArray = this.var_short_arr_arr_a[by];
            sArray[12] = (short)(sArray[12] + 1);
        } else {
            this.var_byte_arr_e[1515 + by7] = 1;
            short[] sArray = this.var_short_arr_arr_a[by];
            sArray[13] = (short)(sArray[13] + 1);
        }
        if (by4 < 12) {
            this.var_byte_arr_e[2828 + by7] = 17;
            this.var_byte_arr_e[2929 + by7] = 14;
            byte by10 = (byte)(5 + this.int_a(255, 10));
            this.var_byte_arr_e[1919 + by7] = by10;
            this.var_byte_arr_e[6767 + by7] = by10;
            this.var_byte_arr_e[1010 + by7] = 8;
        } else {
            this.var_byte_arr_e[2828 + by7] = 69;
            this.var_byte_arr_e[2929 + by7] = 8;
            byte by11 = (byte)((this.var_byte_q == 0 && by == 1 ? 20 : 40) + (this.var_byte_arr_e[1515 + by7] - 1) * -10 + this.int_a(255, 15));
            this.var_byte_arr_e[1919 + by7] = by11;
            this.var_byte_arr_e[6767 + by7] = by11;
            this.var_byte_arr_e[1010 + by7] = (byte)((by5 & 7) == 0 ? 8 : 9 - (by5 & 7));
        }
        this.var_byte_arr_e[4444 + by7] = by7;
        this.var_byte_arr_e[6565 + by7] = 9;
        if ((by5 & 0x40) != 0) {
            this.var_byte_arr_e[6565 + by7] = (byte)this.int_a(255, 4 + by * 2);
        }
        if (this.var_byte_q == 3) {
            this.var_byte_arr_e[6565 + by7] = 0;
        }
        if ((this.var_byte_q == 4 || this.var_byte_q == 5) && this.var_byte_arr_e[6565 + by7] == 1) {
            this.var_byte_arr_e[6565 + by7] = 3;
        }
        this.var_byte_arr_e[3333 + by7] = -1;
        this.var_byte_arr_e[8282 + by7] = 0;
        this.var_byte_arr_e[7979 + by7] = 0;
        this.var_byte_arr_e[8080 + by7] = 0;
        this.var_byte_arr_e[2626 + by7] = 0;
        this.var_byte_arr_e[2525 + by7] = 0;
        this.var_byte_arr_e[2424 + by7] = 0;
        this.var_byte_arr_e[2323 + by7] = 0;
        this.var_byte_arr_e[2222 + by7] = 0;
        this.g((int)by7);
        this.b(by7);
        if (this.var_byte_arr_arr_c[by3][by2] == 0) {
            this.var_byte_arr_arr_c[by3][by2] = by7;
        }
        if (!this.var_boolean_s) {
            short[] sArray = this.var_short_arr_arr_a[by];
            sArray[11] = (short)(sArray[11] + 1);
            if (by == 0) {
                this.a((byte)1, by2, by3, by7);
            }
            short[] sArray2 = this.var_short_arr_arr_a[by];
            sArray2[19] = (short)(sArray2[19] + 1);
        }
        if (by == 0) {
            this.var_b_a.a((int)this.var_byte_arr_e[0 + by7], (int)this.var_byte_arr_e[101 + by7], (int)this.var_byte_arr_e[4949 + by7]);
        }
        return by7;
    }

    final void a(byte by) {
        byte by2 = (byte)((by - 1) / 50);
        int n = this.var_byte_arr_e[0 + by] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[606 + by]];
        int n2 = this.var_byte_arr_e[101 + by] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[606 + by]];
        if ((this.var_byte_arr_e[2929 + by] & 0xFF) <= 7 && (this.var_byte_arr_e[1111 + by] & 0xF) < (this.var_byte_arr_a[this.var_short_arr_a[15] + (this.var_byte_arr_e[606 + by] & 1) * 9 + this.var_byte_arr_e[1010 + by] - this.var_byte_arr_e[7777 + by]] + 1) / 2 && this.var_byte_arr_arr_c[n2][n] == -128) {
            this.var_byte_arr_arr_c[n2][n] = this.var_byte_arr_e[4545 + by] >= 111 ? -this.var_byte_arr_e[4545 + by] : (byte)0;
        }
        this.void_e((int)by);
        this.f((int)by);
        this.var_byte_arr_e[1919 + by] = -1;
        this.void_c((int)by);
        if (this.var_boolean_F || by == this.var_byte_arr_e[8810 + this.var_int_q]) {
            this.var_boolean_P = true;
        }
        if (!this.var_boolean_s) {
            if (by2 == 0) {
                this.a((byte)3, this.var_byte_arr_e[0 + by], this.var_byte_arr_e[101 + by], by);
            }
            short[] sArray = this.var_short_arr_arr_a[1 - by2];
            sArray[22] = (short)(sArray[22] + 1);
        }
    }

    private void f(int n, int n2) {
        this.var_byte_J = this.var_byte_I;
        this.var_byte_L = this.var_byte_K;
        if (n > 100) {
            this.var_byte_I = (byte)(this.var_byte_arr_e[9359 + n - 101] - this.var_byte_C);
            this.var_byte_K = (byte)(this.var_byte_arr_e[9381 + n - 101] - this.var_byte_D + n2);
        } else if (n > 0) {
            this.var_byte_I = (byte)(this.var_byte_arr_e[0 + n] - this.var_byte_C);
            this.var_byte_K = (byte)(this.var_byte_arr_e[101 + n] - this.var_byte_D + n2);
        } else if (n == -100) {
            this.var_byte_I = (byte)(this.var_byte_I - this.var_byte_C);
            this.var_byte_K = (byte)(this.var_byte_K - (this.var_byte_D - n2));
        } else if (n < 0) {
            this.var_byte_I = (byte)(this.var_byte_arr_e[8383 + -n] + (this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + this.var_byte_arr_e[8749 + -n]] >> 1) - this.var_byte_C);
            this.var_byte_K = (byte)(this.var_byte_arr_e[8444 + -n] + (this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + this.var_byte_arr_e[8749 + -n]] >> 1) - this.var_byte_D + n2);
        } else {
            return;
        }
        this.aK();
        this.var_boolean_A = true;
    }

    final void void_b(int n, int n2) {
        int n3;
        for (n3 = 1; n3 <= 50; n3 = (int)((byte)(n3 + 1))) {
            if (this.var_byte_arr_e[1919 + n3] <= 0) continue;
            this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3]][this.var_byte_arr_e[0 + n3]] = 0;
        }
        for (n3 = 1; n3 <= 50; n3 = (int)((byte)(n3 + 1))) {
            if (this.var_byte_arr_e[1919 + n3] <= 0) continue;
            if (this.var_byte_arr_arr_c[n2][n] != 0) {
                this.var_b_a.var_int_v = 0;
                this.var_b_a.a(1, 127, n, n2);
                n = this.var_byte_arr_e[3131];
                n2 = this.var_byte_arr_e[3232];
            }
            if ((this.var_byte_arr_e[2929 + n3] & 0xFF) <= 7 && (this.var_byte_arr_e[1111 + n3] & 0xF) < (this.var_byte_arr_a[this.var_short_arr_a[15] + (this.var_byte_arr_e[606 + n3] & 1) * 9 + this.var_byte_arr_e[1010 + n3] - this.var_byte_arr_e[7777 + n3]] + 1) / 2 && this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[606 + n3]]][this.var_byte_arr_e[0 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[606 + n3]]] == -128) {
                this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[606 + n3]]][this.var_byte_arr_e[0 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[606 + n3]]] = 0;
            }
            byte by = (byte)n;
            this.var_byte_arr_e[3131 + n3] = by;
            this.var_byte_arr_e[6262 + n3] = by;
            this.var_byte_arr_e[0 + n3] = by;
            byte by2 = (byte)n2;
            this.var_byte_arr_e[3232 + n3] = by2;
            this.var_byte_arr_e[6363 + n3] = by2;
            this.var_byte_arr_e[101 + n3] = by2;
            this.var_byte_arr_e[303 + n3] = 0;
            this.var_byte_arr_e[202 + n3] = 0;
            this.var_byte_arr_e[808 + n3] = 0;
            this.var_byte_arr_e[2828 + n3] = 69;
            this.var_byte_arr_e[2929 + n3] = 8;
            this.var_byte_arr_e[3030 + n3] = 0;
            this.var_byte_arr_e[6161 + n3] = 0;
            this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3]][this.var_byte_arr_e[0 + n3]] = n3;
            this.var_b_a.a((int)this.var_byte_arr_e[0 + n3], (int)this.var_byte_arr_e[101 + n3], (int)this.var_byte_arr_e[4949 + n3]);
        }
    }

    final void f(int n) {
        if (this.var_byte_k == n) {
            this.var_byte_k = 0;
            if (this.var_byte_w == 1) {
                this.var_byte_w = 0;
                this.var_byte_l = 0;
                this.a(true, true, false, false);
                return;
            }
            if (this.var_byte_w == 2 && this.var_byte_arr_e[8749 + this.var_int_q] == 6) {
                this.var_byte_w = 0;
                this.a(true, true, false, false);
            }
        }
    }

    final void b(byte by) {
        int n = 2;
        if (by >= 51) {
            n = by == 51 ? 4 : 3;
        } else if (this.var_byte_arr_e[1414 + by] < 12) {
            n = 0;
        } else if (this.var_byte_arr_e[1414 + by] < 35) {
            n = 1;
        }
        this.var_byte_arr_e[2727 + by] = (byte)(this.var_byte_arr_a[this.var_short_arr_a[189] + this.var_byte_arr_e[1515 + by] * 10 + n * 2] + this.int_a(255, (int)this.var_byte_arr_a[this.var_short_arr_a[189] + this.var_byte_arr_e[1515 + by] * 10 + n * 2 + 1]));
        if (by == this.var_byte_l) {
            this.var_boolean_arr_b[4] = this.var_boolean_arr_a[4];
        }
    }

    final void g(int n) {
        this.var_byte_arr_e[6868 + n] = (byte)(n == 51 || n == 52 ? -2 : (byte)(n > 51 ? -1 : (byte)((n > 3 ? 1 + this.int_a(65535, 58) : n) % 60 + 60 * this.var_byte_arr_e[1515 + n] - 1)));
    }

    private static byte byte_b(int n) {
        if (n <= -1 && n >= -30) {
            return 0;
        }
        if (n <= -31 && n >= -60) {
            return 1;
        }
        return 2;
    }

    final byte a(byte by, int n, int n2, int n3, int n4, boolean bl, int n5) {
        int n6 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + n];
        int n7 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + n];
        byte by2 = (byte)(1 + by * 30);
        byte by3 = 0;
        try {
            int n8;
            while (this.var_byte_arr_e[8505 + by2 + by3] != 0) {
                by3 = (byte)(by3 + 1);
            }
            if (by3 >= 30) {
                if (by == 0) {
                    this.var_int_s = 100;
                    this.l(-1);
                    this.var_byte_arr_u[0] = 0;
                    this.a((byte)10, (byte)0, (byte)0, (byte)0);
                }
                return -1;
            }
            by3 = (byte)(by3 + by2);
            if (n5 == -1) {
                if (!this.a(n, n2, n3, !bl)) {
                    return -2;
                }
            } else {
                by3 = (byte)n5;
            }
            if (n >= 20 && n <= 22) {
                if (n5 == -1) {
                    for (by3 = 0; by3 < 30 && this.var_byte_arr_arr_f[0][by3] != 0; by3 = (byte)((byte)(by3 + 1))) {
                    }
                } else {
                    by3 = (byte)n5;
                }
                if (by3 == 30) {
                    return -1;
                }
                this.var_byte_arr_arr_f[0][by3] = (byte)this.var_int_q;
                this.var_byte_arr_arr_f[2][by3] = (byte)n2;
                this.var_byte_arr_arr_f[3][by3] = (byte)n3;
                this.var_byte_arr_arr_f[1][by3] = (byte)n;
                if (!bl) {
                    byte[] byArray = this.var_byte_arr_arr_arr_a[0][this.var_byte_au];
                    int n9 = 6 + this.var_int_s - 20;
                    byArray[n9] = (byte)(byArray[n9] + 1);
                    this.var_byte_arr_arr_c[n3][n2] = by == 0 ? -123 : -126;
                } else {
                    this.var_byte_arr_arr_c[n3][n2] = (byte)(20 - n - 111 - by * 6);
                }
                this.c(n2, n3, 1, 1);
                return by3;
            }
            if (n == 0) {
                n8 = 0;
                while (this.var_byte_arr_arr_arr_a[by][n8][11] != 0) {
                    byte by4 = (byte)(n8 + 1);
                    n8 = by4;
                    if (by4 <= 10) continue;
                    return -1;
                }
                this.var_byte_arr_arr_arr_a[by][n8][11] = by3;
            }
            this.c(n2, n3, n6, n7);
            this.var_byte_arr_e[8383 + by3] = (byte)n2;
            this.var_byte_arr_e[8444 + by3] = (byte)n3;
            this.var_byte_arr_e[8749 + by3] = (byte)n;
            this.var_byte_arr_e[8871 + by3] = 0;
            this.var_byte_arr_e[9176 + by3] = 0;
            this.var_byte_arr_e[8932 + by3] = 0;
            this.var_byte_arr_e[8993 + by3] = 0;
            this.var_byte_arr_e[9054 + by3] = 0;
            if (n4 == 0) {
                n4 = this.var_byte_arr_a[this.var_short_arr_a[113] + (this.var_byte_q < 2 ? 0 : (this.var_byte_q == 2 ? 12 : 24)) + n];
            }
            this.var_byte_arr_e[9115 + by3] = (byte)n4;
            this.var_byte_arr_e[8810 + by3] = 0;
            this.var_byte_arr_e[8688 + by3] = 5;
            this.var_byte_arr_e[8627 + by3] = 0;
            byte by5 = this.var_byte_arr_a[this.var_short_arr_a[138] + 182 + n];
            this.var_byte_arr_e[8566 + by3] = by5;
            this.var_byte_arr_e[8505 + by3] = by5;
            if (n >= 12 && n <= 19) {
                if (!this.var_b_a.a(by3)) {
                    if (by == 0) {
                        this.var_int_s = 100;
                        this.l(-1);
                        this.var_byte_arr_u[0] = 0;
                        this.a((byte)10, (byte)0, (byte)0, (byte)0);
                    }
                    this.var_byte_arr_e[8505 + by3] = 0;
                    return -1;
                }
                this.var_byte_arr_e[9237 + by3] = (byte)(by == 0 ? this.var_byte_arr_r[this.var_byte_as] : this.var_b_a.var_int_v);
                this.var_byte_arr_e[8566 + by3] = this.var_byte_arr_a[this.var_short_arr_a[138] + 182 + this.var_byte_arr_e[9237 + by3]];
                this.var_byte_arr_e[9115 + by3] = 3;
            } else if (by == 0) {
                this.var_b_a.a(this.var_byte_arr_e[8383 + by3] + this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + this.var_byte_arr_e[8749 + by3]] / 2, this.var_byte_arr_e[8444 + by3] + this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + this.var_byte_arr_e[8749 + by3]] / 2, this.var_byte_arr_e[8688 + by3] & 0xF);
            }
            for (n8 = 0; n8 < n7; ++n8) {
                for (int i = 0; i < n6; ++i) {
                    this.var_byte_arr_arr_c[n3 + n8][n2 + i] = -by3;
                }
            }
            if (n == 2) {
                short[] sArray = this.var_short_arr_arr_a[by];
                sArray[16] = (short)(sArray[16] + 4);
                if (this.var_short_arr_arr_a[by][16] > 50) {
                    this.var_short_arr_arr_a[by][16] = 50;
                }
            }
            if (!this.var_boolean_s && n5 == -1) {
                short[] sArray = this.var_short_arr_arr_a[by];
                sArray[14] = (short)(sArray[14] + 1);
                short[] sArray2 = this.var_short_arr_arr_a[by];
                sArray2[20] = (short)(sArray2[20] + 1);
            }
            if (n == 2) {
                this.var_b_a.a((int)by3);
            }
            if (bl && by == 0) {
                this.a((byte)5, (byte)n2, (byte)n3, (byte)0);
            }
            return by3;
        }
        catch (Exception exception) {
            return -1;
        }
    }

    final void c(int n, boolean bl) {
        int n2;
        byte by = this.var_byte_arr_e[8749 + n];
        byte by2 = this.var_byte_arr_e[8383 + n];
        byte by3 = this.var_byte_arr_e[8444 + n];
        int n3 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + by];
        int n4 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + by];
        int n5 = n2 = n < 31 ? 0 : 1;
        if (by == 2) {
            this.var_b_a.a(n);
        }
        try {
            block16: {
                block15: {
                    int n6;
                    block14: {
                        if (!bl) break block14;
                        this.f(n == 1 ? -1 : 0, 0);
                        this.var_byte_arr_e[8505 + n] = -1;
                        this.void_a(n, 3);
                        byte by4 = this.var_byte_arr_e[8993 + n];
                        while (by4 > 0) {
                            this.a((int)by4, n, true, false);
                            by4 = this.var_byte_arr_e[4545 + by4];
                        }
                        if (this.var_byte_arr_e[8810 + n] > 1 && (this.var_byte_arr_e[8749 + n] != 2 || this.var_byte_arr_e[8627 + n] != 0)) {
                            this.a((int)this.var_byte_arr_e[8810 + n], n, true, false);
                        }
                        if (this.var_byte_w != 2 && this.var_byte_w != 4 || n != this.var_int_q) break block15;
                        break block16;
                    }
                    this.var_byte_arr_e[8505 + n] = 0;
                    this.var_byte_arr_e[8627 + n] = 3;
                    for (n6 = 0; n6 < n4; ++n6) {
                        for (int i = 0; i < n3; ++i) {
                            this.var_byte_arr_arr_c[by3 + n6][by2 + i] = 0;
                        }
                    }
                    if (by == 2) {
                        short[] sArray = this.var_short_arr_arr_a[n2];
                        sArray[16] = (short)(sArray[16] - 4);
                        if (this.var_short_arr_arr_a[n2][16] < 0) {
                            this.var_short_arr_arr_a[n2][16] = 1;
                        }
                        for (n6 = n2 * 50 + 1; n6 <= (n2 + 1) * 50; ++n6) {
                            if (this.var_byte_arr_e[3434 + n6] != n) continue;
                            this.var_byte_arr_e[3434 + n6] = 0;
                        }
                    }
                    if (!this.var_boolean_s) {
                        short[] sArray = this.var_short_arr_arr_a[n2];
                        sArray[14] = (short)(sArray[14] - 1);
                        short[] sArray2 = this.var_short_arr_arr_a[1 - n2];
                        sArray2[21] = (short)(sArray2[21] + 1);
                    }
                    if (by == 0) {
                        n6 = 0;
                        while (this.var_byte_arr_arr_arr_a[n2][n6][11] != n) {
                            byte by5 = (byte)(n6 + 1);
                            n6 = by5;
                            if (by5 < 10) continue;
                            n6 = (byte)(n6 - 1);
                            break;
                        }
                        this.var_byte_arr_arr_arr_a[n2][n6][11] = 0;
                    }
                    this.var_b_a.c(n);
                    if (n2 == 0) {
                        this.a((byte)8, by2, by3, (byte)0);
                    }
                }
                return;
            }
            this.var_byte_w = 0;
            this.var_int_q = 0;
            this.a(true, true, false, false);
        }
        catch (Exception exception) {}
    }

    private boolean a(int n, int n2, int n3, boolean bl) {
        int n4 = this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + n];
        int n5 = this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + n];
        boolean bl2 = true;
        for (int i = 0; i < n5; ++i) {
            for (int j = 0; j < n4; ++j) {
                if (this.boolean_b(n2 + j, n3 + i) && this.var_byte_arr_arr_c[n3 + i][n2 + j] == 0 && (!bl || this.byte_a(n2 + j, n3 + i) == 0)) continue;
                bl2 = false;
            }
        }
        return bl2;
    }

    /*
     * Unable to fully structure code
     */
    private void a(int var1_1, int var2_2, boolean var3_3, boolean var4_4) {
        block11: {
            block7: {
                block10: {
                    block8: {
                        block9: {
                            if (this.var_byte_arr_e[2828 + var1_1] == 93 || this.var_byte_arr_e[2828 + var1_1] == 92 || this.var_byte_arr_e[2828 + var1_1] == 106) {
                                var3_3 = true;
                            }
                            if (this.var_byte_arr_e[8810 + var2_2] != var1_1 || this.var_byte_arr_e[8749 + var2_2] == 2 && this.var_byte_arr_e[8627 + var2_2] == 0) break block7;
                            if (var3_3) {
                                this.var_byte_arr_e[8810 + var2_2] = 0;
                            }
                            this.void_d(var2_2);
                            if (this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + var1_1]][this.var_byte_arr_e[0 + var1_1]] == var1_1) break block8;
                            if (var3_3) break block9;
                            this.var_byte_arr_e[2828 + var1_1] = 87;
                            ** GOTO lbl-1000
                        }
                        this.var_byte_arr_e[6161 + var1_1] = 2;
                        break block10;
                    }
                    this.var_byte_arr_e[3131 + var1_1] = this.var_byte_arr_e[0 + var1_1];
                    this.var_byte_arr_e[3232 + var1_1] = this.var_byte_arr_e[101 + var1_1];
                    if (var3_3) {
                        this.var_byte_arr_e[6262 + var1_1] = this.var_byte_arr_e[0 + var1_1];
                        this.var_byte_arr_e[6363 + var1_1] = this.var_byte_arr_e[101 + var1_1];
                    }
                    this.var_byte_arr_e[2828 + var1_1] = 69;
                    if (var3_3) {
                        this.var_byte_arr_e[6161 + var1_1] = 2;
                        this.var_byte_arr_e[4747 + var1_1] = 0;
                    } else lbl-1000:
                    // 2 sources

                    {
                        this.var_byte_arr_e[6161 + var1_1] = 3;
                    }
                }
                if (var4_4) {
                    this.a(var2_2, false);
                    return;
                }
                break block11;
            }
            if (!var3_3 || this.var_byte_arr_e[8627 + var2_2] == 0 && (this.var_byte_arr_e[8749 + var2_2] == 2 || this.var_byte_arr_e[8749 + var2_2] == 7 || this.var_byte_arr_e[8749 + var2_2] == 4 || this.var_byte_arr_e[8749 + var2_2] == 8)) {
                this.var_byte_arr_e[2828 + var1_1] = 87;
                this.var_byte_arr_e[6161 + var1_1] = 3;
                return;
            }
            this.var_byte_arr_e[6161 + var1_1] = 2;
        }
    }

    final void h(int n) {
        this.f(n);
        this.void_e(n);
    }

    final byte byte_a(int n, byte by) {
        byte by2;
        byte by3 = 1;
        int n2 = 0;
        if (n >= 51) {
            by3 = 31;
            n2 = 1;
        }
        while (by3 < 30) {
            if (this.var_byte_arr_e[8810 + by3 + 0] == n) {
                by3 = (byte)(by3 + 0);
                break;
            }
            by3 = (byte)(by3 + 1);
        }
        for (by2 = 0; by2 < 30; by2 = (byte)(by2 + 1)) {
            if (this.var_byte_arr_arr_arr_b[n2][0][by2] != by3) continue;
            this.var_byte_arr_arr_arr_b[n2][4][by2] = by;
            break;
        }
        return by2;
    }

    private static boolean boolean_b(int n) {
        return n >= 101 && n <= 122;
    }

    final void b(int n, int n2, int n3, int n4) {
        int n5;
        for (n5 = 0; n5 < 22; n5 = (int)((byte)(n5 + 1))) {
            if (this.var_byte_arr_e[9513 + n5] != 0) continue;
            if (this.var_byte_q == 3) break;
            int n6 = n4;
            this.var_byte_arr_t[n6] = (byte)(this.var_byte_arr_t[n6] + 1);
            break;
        }
        this.var_byte_arr_e[9513 + n5] = this.var_byte_arr_a[this.var_short_arr_a[180] + n];
        this.var_byte_arr_e[9535 + n5] = (byte)n;
        byte by = (byte)n2;
        this.var_byte_arr_e[9645 + n5] = by;
        this.var_byte_arr_e[9359 + n5] = by;
        byte by2 = (byte)n3;
        this.var_byte_arr_e[9667 + n5] = by2;
        this.var_byte_arr_e[9381 + n5] = by2;
        this.var_byte_arr_e[9425 + n5] = 0;
        this.var_byte_arr_e[9403 + n5] = 0;
        this.var_byte_arr_e[9689 + n5] = 0;
        this.var_byte_arr_e[9711 + n5] = 0;
        this.var_byte_arr_e[9601 + n5] = 0;
        this.var_byte_arr_e[9491 + n5] = (byte)this.int_a(255, 8);
        this.var_byte_arr_e[9469 + n5] = (byte)n4;
        this.var_byte_arr_e[9557 + n5] = this.var_byte_arr_a[this.var_short_arr_a[184] + n];
        this.var_byte_arr_e[9579 + n5] = 0;
        this.var_byte_arr_e[9447 + n5] = 0;
        this.var_byte_arr_arr_c[n3][n2] = (byte)(101 + n5);
    }

    private static boolean boolean_c(int n) {
        return n <= -61 && n >= -110;
    }

    final void a(int n, int n2, int n3, byte by) {
        int n4;
        for (n4 = 0; n4 < 50 && this.var_byte_arr_e[9833 + n4] != 0; n4 = (int)((byte)(n4 + 1))) {
        }
        if (n4 == 50) {
            n4 = 0;
            while (this.var_byte_arr_e[9833 + n4] != 6 || this.var_byte_arr_e[9833 + n4] != 7) {
                n4 = (byte)(n4 + 1);
            }
            this.var_byte_arr_arr_c[this.var_byte_arr_e[9783 + n4]][this.var_byte_arr_e[9733 + n4]] = 0;
        }
        this.var_byte_arr_e[9833 + n4] = (byte)n;
        this.var_byte_arr_e[9733 + n4] = (byte)n2;
        this.var_byte_arr_e[9783 + n4] = (byte)n3;
        this.var_byte_arr_e[9883 + n4] = by;
        this.var_byte_arr_arr_c[n3][n2] = (byte)(-61 - n4);
    }

    private static byte byte_c(int n) {
        if (n <= -111 && n >= -116) {
            return 0;
        }
        if (n <= -117 && n >= -122) {
            return 1;
        }
        if (n == -123) {
            return 3;
        }
        return 2;
    }

    private boolean boolean_b(int n, int n2) {
        return n >= 0 && n2 >= 0 && n < this.var_short_c && n2 < this.var_short_d;
    }

    private byte byte_a(int n, int n2) {
        if ((this.var_int_arr_arr_arr_a[0][n >> 5][n2] >> n & 0x1F & 1) == 0) {
            return 2;
        }
        if ((this.var_int_arr_arr_arr_a[1][n >> 5][n2] >> n & 0x1F & 1) == 0) {
            return 1;
        }
        return 0;
    }

    final void c(int n, int n2, int n3, int n4) {
        for (int i = n2; i < n2 + n4; ++i) {
            for (int j = n; j < n + n3; ++j) {
                if (!this.boolean_a(j, i)) continue;
                this.var_boolean_arr_arr_a[i - this.var_byte_K][j - this.var_byte_I] = true;
            }
        }
        this.var_boolean_B = true;
    }

    private void a(boolean bl, boolean bl2, boolean bl3, boolean bl4) {
        this.a(bl, bl2, bl3, bl4, false, false, false, false, false);
    }

    private void a(boolean bl, boolean bl2, boolean bl3, boolean bl4, boolean bl5, boolean bl6, boolean bl7, boolean bl8, boolean bl9) {
        this.var_boolean_arr_b[0] = this.var_boolean_arr_a[0] = bl;
        this.var_boolean_arr_b[1] = this.var_boolean_arr_a[1] = bl2;
        this.var_boolean_arr_b[2] = this.var_boolean_arr_a[2] = bl3;
        this.var_boolean_arr_b[4] = this.var_boolean_arr_a[4] = bl4;
        this.var_boolean_arr_b[5] = this.var_boolean_arr_a[5] = bl5;
        this.var_boolean_arr_b[6] = this.var_boolean_arr_a[6] = bl6;
        this.var_boolean_arr_b[7] = this.var_boolean_arr_a[7] = bl7;
        this.var_boolean_arr_b[8] = this.var_boolean_arr_a[8] = bl8;
        this.var_boolean_arr_b[9] = this.var_boolean_arr_a[9] = bl9;
        this.var_boolean_arr_a[17] = true;
        this.var_boolean_arr_b[17] = true;
        if (bl2) {
            if (this.var_byte_arr_u[0] == 0) {
                this.var_boolean_arr_a[1] = true;
                this.var_boolean_arr_b[1] = true;
                this.var_boolean_arr_a[9] = false;
                this.var_boolean_arr_b[9] = false;
            } else if (this.var_byte_arr_u[0] != 0) {
                this.var_boolean_arr_a[9] = true;
                this.var_boolean_arr_b[9] = true;
                this.var_boolean_arr_a[1] = false;
                this.var_boolean_arr_b[1] = false;
            }
        }
        int n = this.bb;
        if (this.var_boolean_arr_a[4]) {
            this.bb = 48;
            this.var_byte_ax = this.var_byte_arr_d[3];
        } else {
            this.bb = 22;
            this.var_byte_ax = this.var_byte_arr_d[2];
        }
        if (n < this.bb && this.var_int_ag == 0 && this.var_byte_K < this.var_short_d - 1) {
            this.var_int_ag = 1;
            this.var_byte_K = (byte)(this.var_byte_K + 1);
            this.var_byte_A = (byte)(this.var_byte_A - 1);
            if (this.var_byte_K < this.var_short_d - 1) {
                this.var_byte_K = (byte)(this.var_byte_K + 1);
                this.var_byte_A = (byte)(this.var_byte_A - 1);
                this.var_boolean_A = true;
            }
        } else if (n > this.bb && !bl4 && this.var_int_ag == 0 && this.var_byte_K > 0) {
            this.var_int_ag = -1;
            this.var_byte_K = (byte)(this.var_byte_K - 1);
            this.var_byte_A = (byte)(this.var_byte_A + 1);
            if (this.var_byte_K > 0) {
                this.var_byte_K = (byte)(this.var_byte_K - 1);
                this.var_byte_A = (byte)(this.var_byte_A + 1);
                this.var_boolean_A = true;
            }
        }
        if (this.var_boolean_arr_a[1]) {
            this.var_byte_ad = 1;
        } else if (this.var_boolean_arr_a[2]) {
            this.var_byte_ad = (byte)2;
        } else if (this.var_boolean_arr_a[5]) {
            this.var_byte_ad = (byte)5;
        } else if (this.var_boolean_arr_a[6]) {
            this.var_byte_ad = (byte)6;
        } else if (this.var_boolean_arr_a[9]) {
            this.var_byte_ad = (byte)9;
        }
        this.ba = this.var_int_arr_b[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + this.var_byte_ad]];
        byte by = this.var_byte_P;
        this.var_byte_P = (byte)((319 - this.bb - this.ba + this.var_byte_arr_d[2]) / 16 + 1);
        if (this.var_byte_P > by) {
            this.var_boolean_C = true;
        }
        this.var_int_A = this.var_byte_P * 16;
        this.var_int_A += 16;
        this.var_int_arr_c[2] = this.var_int_arr_c[3] = this.var_int_A;
        this.var_int_arr_c[7] = this.var_int_arr_c[10] = this.var_int_A + this.bb;
        this.var_int_arr_c[5] = this.var_int_arr_c[10];
        this.var_int_arr_c[4] = this.var_int_arr_c[10];
        this.var_int_arr_c[11] = this.var_int_arr_c[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + this.var_byte_ad]] + this.var_int_arr_b[this.var_byte_arr_a[this.var_short_arr_a[195] + 0 + this.var_byte_ad]];
    }

    final void a(byte by, byte by2, byte by3, byte by4) {
        if (this.var_int_c == 0 || this.var_byte_u > 0) {
            return;
        }
        boolean bl = false;
        if (by != 100) {
            bl = true;
            for (int i = 0; i < 10; ++i) {
                if (this.var_byte_arr_u[i] != 0) continue;
                this.var_byte_arr_u[i] = by;
                this.var_byte_arr_arr_k[0][i] = by2;
                this.var_byte_arr_arr_k[1][i] = by3;
                this.var_byte_arr_arr_k[2][i] = by4;
                this.var_int_arr_g[i] = 0;
                break;
            }
        } else if (this.var_byte_arr_u[0] != 0) {
            boolean bl2 = false;
            bl = true;
            this.var_byte_ay = 0;
            int n = 0;
            while (n < 9) {
                int n2 = n++;
                this.var_int_arr_g[n2] = this.var_int_arr_g[n2] + 1;
            }
            if (this.var_byte_arr_u[1] != 0) {
                if (this.var_int_arr_g[0] > 1) {
                    bl2 = true;
                }
            } else if (this.var_int_arr_g[0] > 4) {
                bl2 = true;
            }
            if (bl2) {
                for (n = 0; n < 9; ++n) {
                    this.var_byte_arr_u[n] = this.var_byte_arr_u[n + 1];
                    this.var_byte_arr_arr_k[0][n] = this.var_byte_arr_arr_k[0][n + 1];
                    this.var_byte_arr_arr_k[1][n] = this.var_byte_arr_arr_k[1][n + 1];
                    this.var_byte_arr_arr_k[2][n] = this.var_byte_arr_arr_k[2][n + 1];
                    this.var_int_arr_g[n] = this.var_int_arr_g[n + 1];
                    this.var_byte_arr_u[n + 1] = 0;
                }
                if (this.var_byte_arr_u[0] != 0 && this.var_byte_arr_u[1] == 0) {
                    this.var_int_arr_g[0] = 0;
                }
            }
        }
        if (bl && (this.var_boolean_arr_a[1] || this.var_boolean_arr_a[9])) {
            this.a(this.var_boolean_arr_a[0], true, false, this.var_boolean_arr_a[4]);
            this.var_byte_ay = this.var_byte_arr_arr_k[0][0] == 0 && this.var_byte_arr_arr_k[1][0] == 0 ? (byte)0 : 1;
        }
    }

    private void g(byte by) {
        try {
            this.var_byte_q = by;
            this.aM();
            this.aN();
            this.aO();
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void aM() {
        int n;
        int n2;
        this.var_boolean_u = false;
        this.var_boolean_t = false;
        this.var_byte_F = (byte)-1;
        for (n2 = 0; n2 < this.var_short_arr_b[121]; ++n2) {
            this.var_byte_arr_e[n2] = 0;
        }
        for (n2 = 0; n2 <= 100; ++n2) {
            this.var_byte_arr_e[4040 + n2] = -100;
            this.var_byte_arr_e[4242 + n2] = 1;
            this.var_byte_arr_e[4343 + n2] = -1;
        }
        for (n2 = 0; n2 < 50; ++n2) {
            this.var_byte_arr_arr_a[4][n2] = 0;
            this.var_byte_arr_arr_a[3][n2] = 0;
            this.var_byte_arr_arr_a[2][n2] = 0;
        }
        for (n2 = 0; n2 < 10; ++n2) {
            this.var_byte_arr_u[n2] = 0;
        }
        for (n2 = 0; n2 < 5; ++n2) {
            this.var_byte_arr_arr_arr_c[0][n2][2] = -1;
        }
        for (n2 = 0; n2 < 30; n2 = (int)((byte)(n2 + 1))) {
            this.var_byte_arr_arr_e[0][n2] = 0;
        }
        for (n2 = 0; n2 < 3; n2 = (int)((byte)(n2 + 1))) {
            for (n = 0; n < 96; n = (int)((byte)(n + 1))) {
                this.var_int_arr_arr_arr_a[0][n2][n] = 0;
            }
        }
        for (n2 = 0; n2 < 10; n2 = (int)((byte)(n2 + 1))) {
            for (n = 0; n < 12; n = (byte)(n + 1)) {
                this.var_byte_arr_arr_arr_a[0][n2][n] = 0;
                this.var_byte_arr_arr_arr_a[1][n2][n] = 0;
            }
        }
        for (n2 = 0; n2 < 30; n2 = (int)((byte)(n2 + 1))) {
            for (n = 0; n < 4; n = (int)((byte)(n + 1))) {
                this.var_byte_arr_arr_f[n][n2] = 0;
            }
            for (n = 0; n < 5; n = (int)((byte)(n + 1))) {
                this.var_byte_arr_arr_arr_b[1][n][n2] = 0;
                this.var_byte_arr_arr_arr_b[0][n][n2] = 0;
            }
        }
        for (n2 = 0; n2 < 96; ++n2) {
            for (n = 0; n < 96; ++n) {
                this.var_byte_arr_arr_b[n2][n] = 0;
                this.var_byte_arr_arr_c[n2][n] = 0;
            }
        }
        for (n2 = 0; n2 < this.var_byte_P + 3; ++n2) {
            for (n = 0; n < this.var_byte_O; ++n) {
                this.var_byte_arr_arr_g[n2][n] = 0;
            }
        }
        if (!this.var_boolean_s) {
            for (n2 = 0; n2 < 26; n2 = (int)((byte)(n2 + 1))) {
                this.var_short_arr_arr_a[1][n2] = 0;
                this.var_short_arr_arr_a[0][n2] = 0;
            }
            this.var_short_arr_arr_a[0][17] = 0;
        }
        this.var_short_arr_arr_a[0][16] = 1;
        this.t();
        this.var_int_c = 0;
        this.var_int_h = 0;
        this.var_boolean_N = false;
        this.var_boolean_L = false;
        this.var_boolean_F = false;
        this.var_boolean_K = false;
        this.var_int_X = 0;
        this.var_int_W = 0;
        this.aL = 0;
        this.var_byte_u = 0;
        this.var_byte_ay = 0;
        this.var_b_a.a();
        this.i();
        this.var_boolean_k = true;
    }

    private void aN() {
        int n = 0;
        try {
            int n2;
            int n3;
            int n4;
            System.gc();
            Thread.yield();
            Object var4_2 = null;
            int n5 = 0;
            this.var_short_c = this.var_short_e = (short)this.var_byte_arr_a[this.var_short_arr_a[149] + this.var_byte_q * 2];
            this.var_short_d = this.var_short_f = (short)this.var_byte_arr_a[this.var_short_arr_a[149] + this.var_byte_q * 2 + 1];
            if (this.var_byte_q == 0) {
                this.var_short_c = (short)40;
                this.var_short_d = (short)32;
            } else if (this.var_byte_q == 5) {
                this.var_short_c = (short)(this.var_short_c - 32);
            }
            int n6 = 0;
            int n7 = 10;
            for (n4 = 0; n4 < this.var_short_f; ++n4) {
                for (n3 = 0; n3 < this.var_short_e; ++n3) {
                    if (n7 >= this.var_byte_arr_a[this.var_short_arr_a[197] + 0 + n6]) {
                        n = (short)(this.var_byte_arr_v[this.var_int_arr_h[this.var_byte_arr_a[this.var_short_arr_a[248] + this.var_byte_q]] + n5] & 0xFF);
                        ++n5;
                        if (n >= 250) {
                            n7 = 0;
                            n6 = n - 250;
                            n = this.var_byte_arr_a[this.var_short_arr_a[197] + 6 + n6] & 0xFF;
                        }
                    }
                    ++n7;
                    int n8 = n;
                    if (n8 <= 8) {
                        n8 += this.int_a(3, 3);
                    }
                    this.var_byte_arr_arr_b[n4][n3] = (byte)n8;
                    n2 = (this.var_short_arr_arr_b[9][n8] & 0xFFFF) >> 13 & 1;
                    if ((n8 >= 175 || n2 == 1) && this.var_byte_arr_arr_c[n4][n3] != -127) {
                        this.var_byte_arr_arr_c[n4][n3] = -126;
                    } else if (this.var_byte_arr_arr_c[n4][n3] == -126) {
                        this.var_byte_arr_arr_c[n4][n3] = 0;
                    }
                    if (this.var_byte_q != 3) {
                        int n9 = (this.var_byte_arr_arr_j[16][n8] & 0xFFFF) >> 6 & 3;
                        if (n9 == 2) {
                            this.var_byte_arr_arr_c[n4][n3] = -125;
                        }
                        if (n8 >= 180 && n8 <= 231) {
                            this.var_byte_arr_arr_c[n4][n3] = -124;
                        } else if (n8 >= 175 && n8 <= 179) {
                            this.a(n8 - 175 + 1, n3, n4, this.var_byte_arr_a[this.var_short_arr_a[110] + n8 - 175 + 1]);
                        }
                    }
                    if (n4 != 0 && n4 != this.var_short_f - 1 && n3 != this.var_short_e - 1) continue;
                    this.var_byte_arr_arr_c[n4][n3] = -126;
                }
            }
            for (n4 = 0; n4 < this.var_short_d; ++n4) {
                for (n3 = 1; n3 < this.var_short_c - 1; ++n3) {
                    if (!f.boolean_c(this.var_byte_arr_arr_c[n4][n3]) || this.var_byte_arr_e[9833 + (this.var_byte_arr_arr_c[n4][n3] + 61) * -1] != 5) continue;
                    n2 = this.var_byte_arr_arr_b[n4][n3 - 1];
                    if (n2 == 33 || n2 == 34 || n2 == 37 || n2 == 38) {
                        this.var_byte_arr_arr_c[n4][n3 - 1] = -127;
                    }
                    if ((n2 = this.var_byte_arr_arr_b[n4][n3 + 1]) != 33 && n2 != 34 && n2 != 37 && n2 != 38) continue;
                    this.var_byte_arr_arr_c[n4][n3 + 1] = -127;
                }
            }
            return;
        }
        catch (Exception exception) {
            return;
        }
    }

    private void aO() {
        this.aP();
        this.var_short_arr_arr_a[0][17] = this.var_byte_q == 3 ? (short)0 : 1;
        this.var_byte_y = this.var_byte_C;
        this.var_byte_A = this.var_byte_D;
        this.var_byte_I = this.var_byte_J = (byte)(this.var_byte_arr_a[this.var_short_arr_a[150] + this.var_byte_q * 2] - this.var_byte_y);
        this.var_byte_K = this.var_byte_L = (byte)(this.var_byte_arr_a[this.var_short_arr_a[150] + this.var_byte_q * 2 + 1] - this.var_byte_A);
        this.aK();
        this.var_byte_J = this.var_byte_I;
        this.var_byte_L = this.var_byte_K;
        this.var_byte_z = this.var_byte_y;
        this.var_byte_B = this.var_byte_A;
        this.var_b_a.d();
    }

    private void aP() {
        if (this.var_byte_q == 3) {
            this.var_byte_aw = 0;
        }
        short s = this.var_short_arr_a[250 + this.var_byte_q];
        byte by = this.var_byte_arr_a[this.var_short_arr_a[262] + this.var_byte_q];
        for (byte by2 = 0; by2 < by; by2 = (byte)(by2 + 1)) {
            if (this.var_byte_arr_a[s + 0 * by + by2] == -1) continue;
            if (this.var_byte_arr_a[s + 1 * by + by2] >= 0) {
                this.a(this.var_byte_arr_a[s + 0 * by + by2], this.var_byte_arr_a[s + 1 * by + by2], this.var_byte_arr_a[s + 2 * by + by2], this.var_byte_arr_a[s + 3 * by + by2], this.var_byte_arr_a[s + 4 * by + by2], true, -1);
            } else if (this.var_byte_arr_a[s + 1 * by + by2] == -1) {
                this.a((byte)(this.var_byte_arr_a[s + 0 * by + by2] & 1), this.var_byte_arr_a[s + 2 * by + by2], this.var_byte_arr_a[s + 3 * by + by2], this.var_byte_arr_a[s + 4 * by + by2], (byte)((this.var_byte_arr_a[s + 0 * by + by2] >> 1) + ((this.var_byte_arr_a[s + 0 * by + by2] & 1) != 0 ? this.var_byte_b : (byte)0)));
            } else if (this.var_byte_arr_a[s + 1 * by + by2] == -2) {
                this.b(1, (int)this.var_byte_arr_a[s + 2 * by + by2], (int)this.var_byte_arr_a[s + 3 * by + by2], (int)this.var_byte_arr_a[s + 0 * by + by2]);
            }
            if (by2 > 10 || this.var_byte_q == 1 || this.var_byte_q == 6) continue;
            this.var_short_arr_arr_a[0][by2] = this.var_byte_arr_a[this.var_short_arr_a[263] + 11 * this.var_byte_q * 2 + by2];
            this.var_short_arr_arr_a[1][by2] = (short)(this.var_byte_arr_a[this.var_short_arr_a[263] + 11 * (this.var_byte_q * 2 + 1) + by2] * 20);
        }
        if (this.var_byte_q == 0) {
            this.var_byte_arr_e[7476] = 4;
            this.var_byte_arr_e[7479] = 5;
            return;
        }
        if (this.var_byte_q == 3) {
            this.var_byte_aw = (byte)2;
        }
    }

    static boolean a(Graphics graphics, Image image, int n, int n2, int n3, int n4, int n5, int n6, int n7) {
        try {
            graphics.drawRegion(image, n, n2, n3, n4, 0, n5, n6, n7);
            return true;
        }
        catch (Exception exception) {
            return false;
        }
    }

    private static void a(Graphics graphics, int n, int n2, int n3, int n4) {
        graphics.fillRect(11 + n, 8 + n2, n3, n4 + 0);
    }

    private static void b(Graphics graphics, int n, int n2, int n3, int n4) {
        graphics.drawRect(n, n2, n3, n4);
    }

    private static void c(Graphics graphics, int n, int n2, int n3, int n4) {
        graphics.setClip(n, n2, n3, n4);
    }

    private static void d(Graphics graphics, int n, int n2, int n3, int n4) {
        graphics.drawLine(n, n2, n3, n4);
    }

    private boolean boolean_d(int n) {
        boolean bl = false;
        try {
            System.gc();
            Thread.yield();
            RecordStore recordStore = RecordStore.openRecordStore((String)(this.var_java_lang_String_b + n), (boolean)true);
            if (recordStore.getNumRecords() <= 0) {
                recordStore.closeRecordStore();
                return false;
            }
            DataInputStream dataInputStream = new DataInputStream(new ByteArrayInputStream(recordStore.getRecord(1)));
            try {
                if (n == 0) {
                    this.var_int_l = dataInputStream.readInt();
                    this.var_boolean_W = dataInputStream.readBoolean();
                    this.var_byte_r = dataInputStream.readByte();
                    this.var_byte_V = (byte)(4 + this.var_byte_r);
                    this.var_byte_s = dataInputStream.readByte();
                    this.var_byte_t = dataInputStream.readByte();
                    this.var_byte_c = dataInputStream.readByte();
                    this.var_byte_p = dataInputStream.readByte();
                } else {
                    int n2;
                    int n3;
                    this.var_byte_q = dataInputStream.readByte();
                    this.aM();
                    this.var_byte_p = dataInputStream.readByte();
                    this.var_byte_d = dataInputStream.readByte();
                    if (n == 2) {
                        this.var_byte_b = this.var_byte_d;
                    }
                    this.aN();
                    dataInputStream.read(this.var_byte_arr_e);
                    dataInputStream.read(this.var_byte_arr_q);
                    dataInputStream.read(this.var_byte_arr_arr_a[0]);
                    dataInputStream.read(this.var_byte_arr_arr_a[1]);
                    dataInputStream.read(this.var_byte_arr_arr_a[2]);
                    dataInputStream.read(this.var_byte_arr_arr_a[3]);
                    for (n3 = 0; n3 < 26; ++n3) {
                        this.var_short_arr_arr_a[0][n3] = dataInputStream.readShort();
                        this.var_short_arr_arr_a[1][n3] = dataInputStream.readShort();
                    }
                    dataInputStream.read(this.var_byte_arr_arr_e[0]);
                    dataInputStream.read(this.var_byte_arr_arr_e[1]);
                    dataInputStream.read(this.var_byte_arr_arr_e[2]);
                    for (n3 = 0; n3 < 10; ++n3) {
                        for (n2 = 0; n2 < 12; ++n2) {
                            this.var_byte_arr_arr_arr_a[0][n3][n2] = dataInputStream.readByte();
                            this.var_byte_arr_arr_arr_a[1][n3][n2] = dataInputStream.readByte();
                        }
                    }
                    dataInputStream.read(this.var_byte_arr_arr_f[0]);
                    dataInputStream.read(this.var_byte_arr_arr_f[1]);
                    dataInputStream.read(this.var_byte_arr_arr_f[2]);
                    dataInputStream.read(this.var_byte_arr_arr_f[3]);
                    for (n3 = 0; n3 < 5; ++n3) {
                        dataInputStream.read(this.var_byte_arr_arr_arr_b[0][n3]);
                        dataInputStream.read(this.var_byte_arr_arr_arr_b[1][n3]);
                        dataInputStream.read(this.var_byte_arr_arr_arr_c[0][n3]);
                        dataInputStream.read(this.var_byte_arr_arr_arr_c[1][n3]);
                    }
                    this.var_byte_aq = dataInputStream.readByte();
                    this.var_byte_y = this.var_byte_z = dataInputStream.readByte();
                    this.var_byte_A = this.var_byte_B = dataInputStream.readByte();
                    this.var_byte_I = this.var_byte_J = dataInputStream.readByte();
                    this.var_byte_K = this.var_byte_L = dataInputStream.readByte();
                    this.var_byte_h = dataInputStream.readByte();
                    this.var_byte_ai = dataInputStream.readByte();
                    this.var_int_c = dataInputStream.readInt();
                    this.var_boolean_L = dataInputStream.readBoolean();
                    this.var_boolean_N = dataInputStream.readBoolean();
                    for (n3 = 0; n3 < 3; ++n3) {
                        for (n2 = 0; n2 < 96; ++n2) {
                            this.var_int_arr_arr_arr_a[0][n3][n2] = dataInputStream.readInt();
                        }
                    }
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_c[0]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_c[1]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_c[2]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_c[3]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_c[4]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_c[5]);
                    this.var_b_a.var_byte_f = dataInputStream.readByte();
                    this.var_b_a.var_byte_K = dataInputStream.readByte();
                    this.var_b_a.var_byte_R = dataInputStream.readByte();
                    this.var_b_a.var_byte_L = dataInputStream.readByte();
                    this.var_b_a.aQ = dataInputStream.readInt();
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_f[0]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_f[1]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_g[0]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_g[1]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_arr_g[2]);
                    dataInputStream.read(this.var_b_a.var_byte_arr_j);
                    this.var_b_a.var_byte_N = dataInputStream.readByte();
                    this.var_b_a.var_byte_O = dataInputStream.readByte();
                    this.var_b_a.var_byte_g = dataInputStream.readByte();
                    this.var_b_a.var_byte_J = dataInputStream.readByte();
                    this.var_b_a.var_byte_I = dataInputStream.readByte();
                    dataInputStream.read(this.var_byte_arr_t);
                    int n4 = -111;
                    while (n4 >= -122) {
                        byte by = dataInputStream.readByte();
                        n3 = by;
                        if (by == 127) {
                            --n4;
                            continue;
                        }
                        n2 = dataInputStream.readByte();
                        this.var_byte_arr_arr_c[n2][n3] = (byte)n4;
                    }
                    for (n3 = 0; n3 < 30; ++n3) {
                        if (this.var_byte_arr_arr_f[0][n3] == 0) continue;
                        this.var_byte_arr_arr_c[this.var_byte_arr_arr_f[3][n3]][this.var_byte_arr_arr_f[2][n3]] = this.var_byte_arr_arr_f[0][n3] <= 30 ? -123 : -126;
                    }
                    for (n3 = 0; n3 < 50; ++n3) {
                        if (this.var_byte_arr_e[9833 + n3] < 6) continue;
                        this.var_byte_arr_arr_c[this.var_byte_arr_e[9783 + n3]][this.var_byte_arr_e[9733 + n3]] = (byte)(-61 - n3);
                    }
                    for (n3 = 1; n3 <= 100; ++n3) {
                        if (this.var_byte_arr_e[1919 + n3] == 0) continue;
                        this.var_byte_arr_e[808 + n3] = 0;
                        if (this.var_byte_arr_e[4646 + n3] >= 0) continue;
                        this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3]][this.var_byte_arr_e[0 + n3]] = (byte)n3;
                        if ((this.var_byte_arr_e[2929 + n3] & 0xFF) > 7 || (this.var_byte_arr_e[1111 + n3] & 0xF) >= (this.var_byte_arr_a[this.var_short_arr_a[15] + (this.var_byte_arr_e[606 + n3] & 1) * 9 + this.var_byte_arr_e[1010 + n3] - this.var_byte_arr_e[7777 + n3]] + 1) / 2 || this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[606 + n3]]][this.var_byte_arr_e[0 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[606 + n3]]] != 0) continue;
                        this.var_byte_arr_arr_c[this.var_byte_arr_e[101 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[606 + n3]]][this.var_byte_arr_e[0 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[606 + n3]]] = -128;
                    }
                    for (n3 = 0; n3 < 22; ++n3) {
                        this.var_byte_arr_e[9689 + n3] = 0;
                        if (this.var_byte_arr_e[9513 + n3] == 0) continue;
                        this.var_byte_arr_arr_c[this.var_byte_arr_e[9381 + n3]][this.var_byte_arr_e[9359 + n3]] = (byte)(101 + n3);
                        if ((this.var_byte_arr_e[9557 + n3] & 0xFF) > 7 || (this.var_byte_arr_e[9623 + n3] & 0xF) >= (this.var_byte_arr_a[this.var_short_arr_a[15] + (this.var_byte_arr_e[9491 + n3] & 1) * 9 + this.var_byte_arr_a[this.var_short_arr_a[179] + this.var_byte_arr_e[9535 + n3]]] + 1) / 2 || this.var_byte_arr_arr_c[this.var_byte_arr_e[9381 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[9491 + n3]]][this.var_byte_arr_e[9359 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[9491 + n3]]] != 0) continue;
                        this.var_byte_arr_arr_c[this.var_byte_arr_e[9381 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + 8 + this.var_byte_arr_e[9491 + n3]]][this.var_byte_arr_e[9359 + n3] + this.var_byte_arr_a[this.var_short_arr_a[1] + this.var_byte_arr_e[9491 + n3]]] = -128;
                    }
                    for (n3 = 1; n3 <= 60; ++n3) {
                        if (this.var_byte_arr_e[8505 + n3] == 0) continue;
                        for (int i = 0; i < this.var_byte_arr_a[this.var_short_arr_a[138] + 130 + this.var_byte_arr_e[8749 + n3]]; ++i) {
                            for (int j = 0; j < this.var_byte_arr_a[this.var_short_arr_a[138] + 104 + this.var_byte_arr_e[8749 + n3]]; ++j) {
                                this.var_byte_arr_arr_c[this.var_byte_arr_e[8444 + n3] + i][this.var_byte_arr_e[8383 + n3] + j] = (byte)(-n3);
                            }
                        }
                    }
                    this.var_b_a.n();
                    this.var_b_a.j();
                    this.var_b_a.d();
                    this.aK();
                    this.var_byte_J = this.var_byte_I;
                    this.var_byte_L = this.var_byte_K;
                }
                bl = true;
            }
            catch (Exception exception) {}
            dataInputStream.close();
            recordStore.closeRecordStore();
            if (!bl) {
                RecordStore.deleteRecordStore((String)(this.var_java_lang_String_b + n));
                this.boolean_d(n);
            }
            return bl;
        }
        catch (Exception exception) {
            return false;
        }
    }

    private boolean boolean_e(int n) {
        boolean bl = false;
        try {
            RecordStore recordStore = null;
            ByteArrayOutputStream byteArrayOutputStream = null;
            FilterOutputStream filterOutputStream = null;
            try {
                RecordStore.deleteRecordStore((String)(this.var_java_lang_String_b + n));
                recordStore = RecordStore.openRecordStore((String)(this.var_java_lang_String_b + n), (boolean)true);
                byteArrayOutputStream = new ByteArrayOutputStream();
                filterOutputStream = new DataOutputStream(byteArrayOutputStream);
                if (n == 0) {
                    ((DataOutputStream)filterOutputStream).writeInt(this.var_int_l);
                    ((DataOutputStream)filterOutputStream).writeBoolean(this.var_boolean_W);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_r);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_s);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_t);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_c);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_p);
                } else {
                    int n2;
                    int n3;
                    if (n == 2) {
                        this.var_boolean_W = true;
                    } else if (n == 1) {
                        this.var_byte_t = this.var_byte_arr_a[this.var_short_arr_a[248] + this.var_byte_q];
                    }
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_q);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_p);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_d);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_e);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_q);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_a[0]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_a[1]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_a[2]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_a[3]);
                    for (n3 = 0; n3 < 26; ++n3) {
                        ((DataOutputStream)filterOutputStream).writeShort(this.var_short_arr_arr_a[0][n3]);
                        ((DataOutputStream)filterOutputStream).writeShort(this.var_short_arr_arr_a[1][n3]);
                    }
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_e[0]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_e[1]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_e[2]);
                    for (n3 = 0; n3 < 10; ++n3) {
                        for (n2 = 0; n2 < 12; ++n2) {
                            ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_arr_arr_arr_a[0][n3][n2]);
                            ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_arr_arr_arr_a[1][n3][n2]);
                        }
                    }
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_f[0]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_f[1]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_f[2]);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_f[3]);
                    for (n3 = 0; n3 < 5; ++n3) {
                        ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_arr_b[0][n3]);
                        ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_arr_b[1][n3]);
                        ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_arr_c[0][n3]);
                        ((OutputStream)filterOutputStream).write(this.var_byte_arr_arr_arr_c[1][n3]);
                    }
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_aq);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_y);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_A);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_I);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_K);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_h);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_byte_ai);
                    ((DataOutputStream)filterOutputStream).writeInt(this.var_int_c);
                    ((DataOutputStream)filterOutputStream).writeBoolean(this.var_boolean_L);
                    ((DataOutputStream)filterOutputStream).writeBoolean(this.var_boolean_N);
                    for (n3 = 0; n3 < 3; ++n3) {
                        for (n2 = 0; n2 < 96; ++n2) {
                            ((DataOutputStream)filterOutputStream).writeInt(this.var_int_arr_arr_arr_a[0][n3][n2]);
                        }
                    }
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_c[0]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_c[1]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_c[2]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_c[3]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_c[4]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_c[5]);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_f);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_K);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_R);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_L);
                    ((DataOutputStream)filterOutputStream).writeInt(this.var_b_a.aQ);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_f[0]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_f[1]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_g[0]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_g[1]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_arr_g[2]);
                    ((OutputStream)filterOutputStream).write(this.var_b_a.var_byte_arr_j);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_N);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_O);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_g);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_J);
                    ((DataOutputStream)filterOutputStream).writeByte(this.var_b_a.var_byte_I);
                    ((OutputStream)filterOutputStream).write(this.var_byte_arr_t);
                    for (byte by = -111; by >= -122; --by) {
                        for (n3 = 0; n3 < this.var_short_c; ++n3) {
                            for (n2 = 0; n2 < this.var_short_d; ++n2) {
                                if (this.var_byte_arr_arr_c[n2][n3] != by) continue;
                                ((DataOutputStream)filterOutputStream).writeByte(n3);
                                ((DataOutputStream)filterOutputStream).writeByte(n2);
                            }
                        }
                        ((DataOutputStream)filterOutputStream).writeByte(127);
                    }
                }
                recordStore.addRecord(byteArrayOutputStream.toByteArray(), 0, byteArrayOutputStream.size());
                bl = true;
            }
            catch (Exception exception) {}
            if (recordStore != null) {
                recordStore.closeRecordStore();
            }
            if (byteArrayOutputStream != null) {
                byteArrayOutputStream.close();
            }
            if (filterOutputStream != null) {
                filterOutputStream.close();
            }
        }
        catch (Exception exception) {}
        return bl;
    }

    final int int_a(int n, int n2) {
        return (this.var_java_util_Random_a.nextInt() & n) % n2;
    }

    private static long long_a() {
        return System.currentTimeMillis();
    }

    public final void hideNotify() {
        this.d();
    }

    public final void showNotify() {
        this.e();
    }

    public final void d() {
        this.var_boolean_Y = true;
        this.var_boolean_Z = true;
        if (this.var_boolean_aa && !this.var_boolean_ad) {
            this.aR();
        }
        this.var_boolean_ad = true;
    }

    public final void e() {
        this.var_boolean_Y = false;
    }

    private void aQ() {
        this.var_b_a.k();
        var_byte_f = this.var_byte_arr_b[this.var_byte_h * 2 + this.int_a(255, 2)];
        if (this.var_a_a == null || this.var_a_a.a() <= 100 || var_byte_f != var_byte_g) {
            var_byte_g = var_byte_f;
            this.aR();
            String cfr_ignored_0 = "/s" + var_byte_f;
            this.var_a_a = new a("audio/midi");
        }
        this.var_a_a.a(this.var_byte_e);
    }

    private void aR() {
        if (this.var_a_a != null) {
            this.var_a_a.a();
            this.var_a_a.b();
            this.var_a_a = null;
        }
    }

    private void aS() {
        if (this.var_boolean_Z) {
            if (this.var_byte_Q != 27 && this.var_boolean_ac) {
                this.var_boolean_ab = true;
                this.var_byte_v = 0;
                this.var_byte_S = this.var_byte_R;
                this.var_byte_R = this.var_byte_Q;
                this.var_byte_Q = (byte)27;
                this.var_byte_z = this.var_byte_y;
                this.var_byte_B = this.var_byte_A;
                this.var_byte_J = this.var_byte_I;
                this.var_byte_L = this.var_byte_K;
            }
            while (this.var_boolean_Y) {
                this.var_boolean_n = false;
                Thread.yield();
                tribes.a(10);
            }
        }
        this.var_boolean_Z = false;
        this.var_boolean_ad = false;
        if (this.var_byte_Q != 27 && this.var_byte_e == 2 && (this.var_a_a == null || this.var_a_a != null && this.var_a_a.a() != 400)) {
            this.aQ();
        }
        tribes.a(10);
    }

    private void m(int n) {
        if (n == this.var_int_arr_j[0]) {
            for (int i = 0; i < 6; ++i) {
                this.var_int_arr_i[i] = 0;
            }
            this.var_int_arr_i[0] = this.var_int_arr_j[0];
            return;
        }
        if (this.var_int_arr_i[0] == this.var_int_arr_j[0]) {
            int n2;
            for (n2 = 0; n2 < 6; ++n2) {
                if (this.var_int_arr_i[n2] != 0) continue;
                this.var_int_arr_i[n2] = n;
                break;
            }
            this.var_boolean_ae = true;
            for (n2 = 0; n2 < 5; ++n2) {
                if (this.var_int_arr_i[n2] == this.var_int_arr_j[n2]) continue;
                this.var_boolean_ae = false;
                break;
            }
            if (this.var_boolean_ae && this.var_int_arr_i[5] != 0) {
                switch (this.var_int_arr_i[5]) {
                    case 49: {
                        this.var_boolean_af = true;
                        break;
                    }
                    case 51: {
                        this.var_boolean_ag = true;
                        break;
                    }
                    case 55: {
                        short[] sArray = this.var_short_arr_arr_a[0];
                        sArray[0] = (short)(sArray[0] + 100);
                        short[] sArray2 = this.var_short_arr_arr_a[0];
                        sArray2[1] = (short)(sArray2[1] + 100);
                        short[] sArray3 = this.var_short_arr_arr_a[0];
                        sArray3[2] = (short)(sArray3[2] + 100);
                        short[] sArray4 = this.var_short_arr_arr_a[0];
                        sArray4[3] = (short)(sArray4[3] + 100);
                        short[] sArray5 = this.var_short_arr_arr_a[0];
                        sArray5[4] = (short)(sArray5[4] + 100);
                        short[] sArray6 = this.var_short_arr_arr_a[0];
                        sArray6[5] = (short)(sArray6[5] + 3);
                        short[] sArray7 = this.var_short_arr_arr_a[0];
                        sArray7[8] = (short)(sArray7[8] + 3);
                        short[] sArray8 = this.var_short_arr_arr_a[0];
                        sArray8[10] = (short)(sArray8[10] + 3);
                        break;
                    }
                    case 57: {
                        this.var_byte_u = 1;
                        if (this.var_byte_q != 0) break;
                        this.var_byte_q = (byte)(this.var_byte_q + 1);
                    }
                }
                this.var_int_arr_i[0] = 0;
            }
        }
    }

    static {
        var_int_a = -6;
        var_int_b = -7;
        var_javax_microedition_lcdui_Image_arr_a = new Image[4];
        var_javax_microedition_lcdui_Graphics_arr_a = new Graphics[4];
        var_byte_M = 0;
        var_byte_ag = (byte)40;
        var_byte_ah = (byte)60;
    }
}
