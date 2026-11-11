/*
 * Decompiled with CFR 0.152.
 * 
 * Could not load the following classes:
 *  javax.microedition.lcdui.Graphics
 */
import java.io.IOException;
import java.io.InputStream;
import javax.microedition.lcdui.Graphics;

public final class c {
    f var_f_a;
    byte[] var_byte_arr_a;
    short[] var_short_arr_a;
    byte[] var_byte_arr_b = new byte[1674];
    short[] var_short_arr_b = new short[230];
    byte[] var_byte_arr_c = new byte[37488];
    short[] var_short_arr_c = new short[310];
    byte[][] var_byte_arr_arr_a = new byte[][]{this.var_byte_arr_b, this.var_byte_arr_c, this.var_byte_arr_c};
    short[][] var_short_arr_arr_a = new short[][]{this.var_short_arr_b, this.var_short_arr_c, this.var_short_arr_c};
    String[] var_java_lang_String_arr_a = new String[]{"/s", "/t", "/d"};
    byte[][] var_byte_arr_arr_b;
    byte[][] var_byte_arr_arr_c;
    byte[] var_byte_arr_d;
    short[] var_short_arr_d;
    short[] var_short_arr_e;
    short[] var_short_arr_f;
    byte[] var_byte_arr_e;
    byte var_byte_a = 0;
    byte var_byte_b;
    byte var_byte_c;
    byte[] var_byte_arr_f;
    int var_int_a;
    InputStream var_java_io_InputStream_a = null;
    int var_int_b;
    int var_int_c;
    int var_int_d;
    int var_int_e;
    int var_int_f = -1;
    int var_int_g;
    int var_int_h;
    byte var_byte_d;
    int i;
    int j;
    int k;
    int l;
    int m;
    int n;
    int o;
    int p;
    int q;
    short[] var_short_arr_g;
    short[] var_short_arr_h;
    int r;
    int s;
    int t;
    int u;
    int v;
    int w;
    int x;
    int y;
    int z;
    int A;

    public c(f f2) {
        this.var_f_a = f2;
        this.var_byte_arr_a = this.var_f_a.var_byte_arr_a;
        this.var_short_arr_a = this.var_f_a.var_short_arr_a;
    }

    final void a() {
        this.k = 13;
        while (this.k < 33) {
            this.var_short_arr_f[this.k] = 0;
            ++this.k;
        }
        this.var_byte_b = 0;
        this.var_byte_c = 0;
        this.k = 0;
        while (this.k < 122) {
            this.var_byte_arr_f[this.k] = 0;
            ++this.k;
        }
    }

    final void a(int n) {
        this.var_f_a.var_int_w = -1;
        this.var_int_g = n;
        this.var_int_c = this.var_short_arr_a[308];
        while (this.var_int_c < this.var_short_arr_a[309]) {
            if (n < this.var_byte_arr_a[this.var_int_c]) {
                this.var_int_c -= this.var_short_arr_a[308];
                break;
            }
            ++this.var_int_c;
        }
        if (this.var_int_f != this.var_int_c) {
            this.var_int_f = this.var_int_c;
            this.b(2);
        }
    }

    final void b(int n) {
        try {
            try {
                String cfr_ignored_0 = "/" + f.var_byte_a + this.var_java_lang_String_arr_a[n];
                this.var_java_io_InputStream_a = this.getClass().getResourceAsStream("/" + f.var_byte_a + this.var_java_lang_String_arr_a[n] + (n == 2 ? String.valueOf(this.var_int_f) : ""));
                if (this.var_java_io_InputStream_a != null) {
                    if (n < 2) {
                        this.var_int_d = 0;
                        this.var_short_arr_arr_a[n][0] = 0;
                        this.var_int_c = 0;
                    } else {
                        this.var_int_d = 71;
                        this.var_int_c = this.var_short_arr_arr_a[1][71];
                    }
                    while ((this.var_int_b = this.var_java_io_InputStream_a.read()) != -1) {
                        if (this.var_int_b == 124) {
                            ++this.var_int_d;
                            this.var_short_arr_arr_a[n][this.var_int_d] = (short)this.var_int_c;
                            continue;
                        }
                        if (this.var_int_b == 31) {
                            this.var_int_e = 0;
                            while (this.var_int_e < this.var_f_a.var_java_lang_String_a.length()) {
                                this.var_byte_arr_arr_a[n][this.var_int_c] = this.var_byte_arr_a[this.var_short_arr_a[280] + (byte)this.var_f_a.var_java_lang_String_a.charAt(this.var_int_e)];
                                ++this.var_int_e;
                                ++this.var_int_c;
                            }
                            --this.var_int_c;
                        } else {
                            this.var_byte_arr_arr_a[n][this.var_int_c] = this.var_byte_arr_a[this.var_short_arr_a[280] + this.var_int_b];
                        }
                        ++this.var_int_c;
                    }
                }
                this.var_java_io_InputStream_a.close();
                this.var_java_io_InputStream_a = null;
            }
            catch (IOException iOException) {
                return;
            }
        }
        catch (Exception exception) {}
    }

    final void a(int n, int n2, int n3, String string, int n4) {
        this.var_int_a = 0;
        while (this.var_int_a < string.length()) {
            this.var_byte_arr_b[this.var_short_arr_b[228] + this.var_int_a] = this.var_byte_arr_a[this.var_short_arr_a[280] + (byte)string.charAt(this.var_int_a)];
            ++this.var_int_a;
        }
        this.var_short_arr_b[229] = (short)(this.var_short_arr_b[228] + string.length());
        this.a(n, n2, n3, 228, n4);
    }

    final void a(int n, int n2, int n3, int n4, int n5) {
        this.var_int_h = n2 == -100 ? 13 + this.var_byte_b : this.var_byte_a;
        if (this.var_int_h >= 13 && this.var_short_arr_f[this.var_int_h] != 0) {
            return;
        }
        this.var_byte_arr_d[this.var_int_h] = (byte)(this.var_short_arr_b[n4 + 1] - this.var_short_arr_b[n4]);
        this.var_byte_arr_e[this.var_int_h] = (byte)n5;
        if (this.var_int_h >= 13) {
            n5 = 1;
        }
        this.var_short_arr_d[this.var_int_h] = (short)((this.var_byte_arr_d[this.var_int_h] - 1) * (0 + n5));
        this.var_short_arr_f[this.var_int_h] = (short)n;
        this.var_short_arr_e[this.var_int_h] = (short)(this.var_int_h >= 13 ? 0 : n2);
        this.var_int_a = 0;
        while (this.var_int_a < this.var_byte_arr_d[this.var_int_h]) {
            this.var_byte_d = this.var_byte_arr_b[this.var_short_arr_b[n4] + this.var_int_a];
            if (this.var_byte_d == 126) {
                this.var_byte_arr_arr_c[this.var_int_h][this.var_int_a] = this.var_byte_d;
                int n6 = this.var_int_h;
                this.var_short_arr_d[n6] = (short)(this.var_short_arr_d[n6] - ((0 + n5) * 2 + 2));
            } else {
                this.var_byte_arr_arr_c[this.var_int_h][this.var_int_a] = (byte)(this.var_byte_d / 30);
                this.var_byte_arr_arr_b[this.var_int_h][this.var_int_a] = (byte)(this.var_byte_d % 30);
                if (this.var_byte_d / 30 != 0 || this.var_byte_d % 30 < 14) {
                    int n7 = this.var_int_h;
                    this.var_short_arr_d[n7] = (short)(this.var_short_arr_d[n7] + ((this.var_byte_arr_a[this.var_short_arr_a[281 + n5] + this.var_byte_arr_arr_c[this.var_int_h][this.var_int_a] * 21 + this.var_byte_arr_arr_b[this.var_int_h][this.var_int_a] + 1] & 0xFF) - (this.var_byte_arr_a[this.var_short_arr_a[281 + n5] + this.var_byte_arr_arr_c[this.var_int_h][this.var_int_a] * 21 + this.var_byte_arr_arr_b[this.var_int_h][this.var_int_a]] & 0xFF)));
                }
            }
            ++this.var_int_a;
        }
        if (n4 == 97) {
            this.var_f_a.a(1041, 26, n2 - 2);
            this.var_f_a.a(1047, 211, n2 - 2);
        }
        if (this.var_int_h < 13) {
            int n8 = this.var_int_h;
            this.var_short_arr_f[n8] = (short)(this.var_short_arr_f[n8] - this.var_short_arr_d[this.var_int_h] * n3 / 2);
            this.var_byte_a = (byte)(this.var_byte_a + 1);
            return;
        }
        this.var_byte_b = (byte)(this.var_byte_b + 1);
        if (this.var_byte_b >= 20) {
            this.var_byte_b = 0;
        }
    }

    final void a(int n, int n2, int n3, int n4, int n5, int n6, int n7) {
        if (n4 >= 0) {
            this.a(n, n2, 0, n4, n7);
            this.i = this.var_short_arr_d[this.var_int_h] + 1;
            this.j = this.var_int_h;
        }
        if (n5 >= 0) {
            this.a(n + this.i, n2, 0, n5, n7);
            this.i += this.var_short_arr_d[this.var_int_h] + 1;
        }
        if (n6 >= 0) {
            this.a(n + this.i, n2, 0, n6, n7);
            this.i += this.var_short_arr_d[this.var_int_h];
        }
        while (this.j < this.var_byte_a) {
            int n8 = this.j++;
            this.var_short_arr_f[n8] = (short)(this.var_short_arr_f[n8] - this.i * n3 / 2);
        }
    }

    final void a(Graphics graphics) {
        this.k = 0;
        while (this.k < this.var_byte_a) {
            this.m = this.var_short_arr_f[this.k];
            this.l = 0;
            while (this.l < this.var_byte_arr_d[this.k]) {
                if (this.var_byte_arr_arr_c[this.k][this.l] == 126) {
                    this.m -= 0 + this.var_byte_arr_e[this.k] + 2;
                } else {
                    this.n = this.var_short_arr_e[this.k];
                    this.q = this.m;
                    this.o = (this.var_byte_arr_a[this.var_short_arr_a[281 + this.var_byte_arr_e[this.k]] + this.var_byte_arr_arr_c[this.k][this.l] * 21 + this.var_byte_arr_arr_b[this.k][this.l] + 1] & 0xFF) - (this.var_byte_arr_a[this.var_short_arr_a[281 + this.var_byte_arr_e[this.k]] + this.var_byte_arr_arr_c[this.k][this.l] * 21 + this.var_byte_arr_arr_b[this.k][this.l]] & 0xFF);
                    if (this.var_byte_arr_arr_c[this.k][this.l] == 0 && this.var_byte_arr_arr_b[this.k][this.l] >= 14) {
                        this.n -= this.var_byte_arr_a[this.var_short_arr_a[285] + this.var_byte_arr_arr_b[this.k][this.l] - 14];
                        this.q -= 0 + (this.o + this.p) / 2;
                    }
                    f.a(graphics, this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a[0][25 + this.var_byte_arr_e[this.k]], this.var_byte_arr_a[this.var_short_arr_a[281 + this.var_byte_arr_e[this.k]] + this.var_byte_arr_arr_c[this.k][this.l] * 21 + this.var_byte_arr_arr_b[this.k][this.l]] & 0xFF, this.var_byte_arr_a[this.var_short_arr_a[284] + this.var_byte_arr_e[this.k] * 3 + this.var_byte_arr_arr_c[this.k][this.l]], this.o, this.var_byte_arr_a[this.var_short_arr_a[283] + this.var_byte_arr_e[this.k] * 3 + this.var_byte_arr_arr_c[this.k][this.l]], 11 + this.q, 8 + this.n, 20);
                    if (this.var_byte_arr_arr_c[this.k][this.l] != 0 || this.var_byte_arr_arr_b[this.k][this.l] < 14) {
                        this.m += this.o + 0 + this.var_byte_arr_e[this.k];
                    }
                    this.p = this.o;
                }
                ++this.l;
            }
            ++this.k;
        }
        this.var_byte_a = 0;
    }

    final void b() {
        this.k = 13 + this.var_byte_c;
        while (this.k != 13 + this.var_byte_b) {
            int n = this.k;
            this.var_short_arr_e[n] = (short)(this.var_short_arr_e[n] + (this.var_short_arr_e[this.k] / 4 + 1));
            if (this.var_short_arr_e[this.k] >= 15) {
                this.var_short_arr_f[this.k] = 0;
                this.var_byte_c = (byte)(this.var_byte_c + 1);
                if (this.var_byte_c >= 20) {
                    this.var_byte_c = 0;
                }
            }
            if (this.k == 32) {
                this.k = 12;
            }
            ++this.k;
        }
        this.k = 0;
        while (this.k < 122) {
            if (this.var_byte_arr_f[this.k] != 0 && this.k % 3 == this.var_f_a.var_int_c % 3) {
                this.a(this.k, -100, 0, (this.var_byte_arr_f[this.k] > 0 ? "+" : "") + this.var_byte_arr_f[this.k], this.var_byte_arr_f[this.k] > 0 ? 2 : (this.k <= 50 ? 1 : 0));
                this.var_byte_arr_f[this.k] = 0;
            }
            ++this.k;
        }
    }

    final void a(int n, int n2, int n3) {
        this.k = 13 + this.var_byte_c;
        while (this.k != 13 + this.var_byte_b) {
            if (this.var_short_arr_f[this.k] == n) {
                this.m = n2 - this.var_short_arr_d[this.k] / 2 + this.var_f_a.int_a(255, 5) - 2;
                this.n = n3 - 5 - this.var_short_arr_e[this.k] * 2;
                this.l = 0;
                while (this.l < this.var_byte_arr_d[this.k]) {
                    this.o = (this.var_byte_arr_a[this.var_short_arr_a[282] + this.var_byte_arr_arr_c[this.k][this.l] * 21 + this.var_byte_arr_arr_b[this.k][this.l] + 1] & 0xFF) - (this.var_byte_arr_a[this.var_short_arr_a[282] + this.var_byte_arr_arr_c[this.k][this.l] * 21 + this.var_byte_arr_arr_b[this.k][this.l]] & 0xFF);
                    f.a(f.var_javax_microedition_lcdui_Graphics_arr_a[1], this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a[0][26], this.var_byte_arr_a[this.var_short_arr_a[282] + this.var_byte_arr_arr_c[this.k][this.l] * 21 + this.var_byte_arr_arr_b[this.k][this.l]] & 0xFF, this.var_byte_arr_a[this.var_short_arr_a[284] + 3 + this.var_byte_arr_arr_c[this.k][this.l]] + this.var_byte_arr_a[this.var_short_arr_a[283] + 3 + 0] * this.var_byte_arr_e[this.k], this.o, this.var_byte_arr_a[this.var_short_arr_a[283] + 3 + this.var_byte_arr_arr_c[this.k][this.l]], 11 + this.m, 8 + this.n, 20);
                    this.m += this.o + 0 + 1;
                    ++this.l;
                }
            }
            if (this.k >= 32) {
                this.k = 12;
            }
            ++this.k;
        }
    }

    final void b(int n, int n2, int n3, int n4, int n5, int n6, int n7) {
        ++n;
        n3 -= 2;
        n2 += 4;
        n4 -= 4;
        if (n5 >= 71) {
            n5 += this.var_byte_arr_a[this.var_short_arr_a[309] + this.var_int_g] & 0xFF;
        }
        this.w = 0;
        this.u = 0;
        this.var_short_arr_g[0] = this.var_short_arr_arr_a[1][n5];
        this.x = 0;
        this.v = this.var_short_arr_arr_a[1][n5] & 0xFFFF;
        while (this.v < (this.var_short_arr_arr_a[1][n5 + 1] & 0xFFFF)) {
            if (this.var_byte_arr_arr_a[1][this.v] == 42 && (this.var_byte_arr_arr_a[1][this.v + 1] < 90 || this.var_byte_arr_arr_a[1][this.v + 1] >= 112) || this.var_byte_arr_arr_a[1][this.v] == 127) {
                this.w = this.v + 1;
                this.y = this.x;
            }
            if (this.var_byte_arr_arr_a[1][this.v] == 126) {
                this.x -= 0 + n7 + 2;
            } else if (this.var_byte_arr_arr_a[1][this.v] < 127 && (this.var_byte_arr_arr_a[1][this.v] / 30 != 0 || this.var_byte_arr_arr_a[1][this.v] % 30 < 14)) {
                this.x += 0 + n7;
                this.x += this.var_byte_arr_arr_a[1][this.v] >= 90 ? 15 : (this.var_byte_arr_a[this.var_short_arr_a[281 + n7] + this.var_byte_arr_arr_a[1][this.v] / 30 * 21 + this.var_byte_arr_arr_a[1][this.v] % 30 + 1] & 0xFF) - (this.var_byte_arr_a[this.var_short_arr_a[281 + n7] + this.var_byte_arr_arr_a[1][this.v] / 30 * 21 + this.var_byte_arr_arr_a[1][this.v] % 30] & 0xFF);
            }
            if (this.x > n3 && this.w > (this.var_short_arr_g[this.u] & 0xFFFF) || this.var_byte_arr_arr_a[1][this.v] == 127) {
                ++this.u;
                this.var_short_arr_g[this.u] = (short)this.w;
                this.var_short_arr_h[this.u - 1] = (short)(n + (n3 - this.y) * (n6 & 1) / 2);
                this.v = this.w - 1;
                this.x = 0;
            }
            if (this.var_byte_arr_arr_a[1][this.v] == 70 || this.var_byte_arr_arr_a[1][this.v] == 73 || this.var_byte_arr_arr_a[1][this.v] == 78) {
                this.w = this.v + 1;
                this.y = this.x;
            }
            ++this.v;
        }
        if (this.x > 0) {
            ++this.u;
            this.var_short_arr_h[this.u - 1] = (short)(n + (n3 - this.x) * (n6 & 1) / 2);
            this.var_short_arr_g[this.u] = this.var_short_arr_arr_a[1][n5 + 1];
        }
        this.r = n2 + (n6 == 3 && this.u * 17 < n4 ? (n4 - this.u * 17) / 2 : 0);
        this.s = n7;
        this.t = n4 / 17;
    }

    final void a(Graphics graphics, int n) {
        try {
            this.k = n;
            while (this.k < n + this.t && this.k < this.u) {
                this.m = this.var_short_arr_h[this.k];
                this.l = this.var_short_arr_g[this.k] & 0xFFFF;
                while (this.l < (this.var_short_arr_g[this.k + 1] & 0xFFFF)) {
                    if (this.var_byte_arr_arr_a[1][this.l] != 127) {
                        if (this.var_byte_arr_arr_a[1][this.l] == 126) {
                            this.m -= 0 + this.s + 2;
                        } else {
                            this.n = this.r + (this.k - n) * 17;
                            if (this.var_byte_arr_arr_a[1][this.l] > 112) {
                                this.z = this.var_byte_arr_arr_a[1][this.l] - 112 - 1 + 19;
                                this.a(24, this.n, 0, String.valueOf(this.z == 24 ? this.var_f_a.var_short_arr_arr_a[0][this.z] * 10 + this.var_f_a.int_a(65535, 10) : this.var_f_a.var_short_arr_arr_a[0][this.z]), 0);
                                this.a(216, this.n, 2, String.valueOf(this.z == 24 ? this.var_f_a.var_short_arr_arr_a[1][this.z] * 10 + this.var_f_a.int_a(65535, 10) : this.var_f_a.var_short_arr_arr_a[1][this.z]), 0);
                            } else {
                                this.z = this.var_byte_arr_arr_a[1][this.l] / 30;
                                this.A = this.var_byte_arr_arr_a[1][this.l] % 30;
                                this.o = this.z >= 3 ? 15 : (this.var_byte_arr_a[this.var_short_arr_a[281 + this.s] + this.z * 21 + this.A + 1] & 0xFF) - (this.var_byte_arr_a[this.var_short_arr_a[281 + this.s] + this.z * 21 + this.A] & 0xFF);
                                this.q = this.m;
                                if (this.z >= 3) {
                                    this.var_f_a.a(560 + this.var_byte_arr_arr_a[1][this.l] - 90, this.q, this.n + -1);
                                } else {
                                    if (this.z == 0 && this.A >= 14) {
                                        this.n -= this.var_byte_arr_a[this.var_short_arr_a[285] + this.A - 14];
                                        this.q -= 0 + (this.o + this.p) / 2;
                                    }
                                    f.a(graphics, this.var_f_a.var_javax_microedition_lcdui_Image_arr_arr_a[0][25 + this.s], this.var_byte_arr_a[this.var_short_arr_a[281 + this.s] + this.z * 21 + this.A] & 0xFF, this.var_byte_arr_a[this.var_short_arr_a[284] + this.s * 3 + this.z], this.o, this.var_byte_arr_a[this.var_short_arr_a[283] + this.s * 3 + this.z], 11 + this.q, 8 + this.n, 20);
                                }
                                if (this.z != 0 || this.A < 14) {
                                    this.m += this.o + 0 + this.s;
                                }
                                this.p = this.o;
                            }
                        }
                    }
                    ++this.l;
                }
                ++this.k;
            }
            this.var_f_a.var_boolean_Q = n == 0;
            if (n + this.t < this.u) {
                this.var_f_a.var_boolean_R = false;
                return;
            }
            this.var_f_a.var_boolean_R = true;
        }
        catch (Exception exception) {}
    }
}
