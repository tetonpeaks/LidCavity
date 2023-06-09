!     -*- f90 -*-
!     This file is autogenerated with f2py (version:1.22.4)
!     It contains Fortran 90 wrappers to fortran functions.

      subroutine f2pywrapmain (N, Nmax, ctr, u_, v_, P_, P_prime_, mu, r&
     &o, Re, ubn, u_out, v_out, P_out, P_prime_out, cresid_out, vresid_o&
     &ut, uresid_out, main_error_out, iter, f2py_u__d0, f2py_u__d1, f2py&
     &_v__d0, f2py_v__d1, f2py_P__d0, f2py_P__d1, f2py_P_prime__d0, f2py&
     &_P_prime__d1)
                use physics
      integer N
      integer Nmax
      integer ctr
      real(kind=8) mu
      real(kind=8) ro
      real(kind=8) Re
      real(kind=8) ubn
      integer f2py_u__d0
      integer f2py_u__d1
      integer f2py_v__d0
      integer f2py_v__d1
      integer f2py_P__d0
      integer f2py_P__d1
      integer f2py_P_prime__d0
      integer f2py_P_prime__d1
      real(kind=8) u_(f2py_u__d0,f2py_u__d1)
      real(kind=8) v_(f2py_v__d0,f2py_v__d1)
      real(kind=8) P_(f2py_P__d0,f2py_P__d1)
      real(kind=8) P_prime_(f2py_P_prime__d0,f2py_P_prime__d1)
      real(kind=8) u_out(1 + 2 * N,1 + 2 * N)
      real(kind=8) v_out(1 + 2 * N,1 + 2 * N)
      real(kind=8) P_out(N,N)
      real(kind=8) P_prime_out(N,N)
      real(kind=8) cresid_out(Nmax)
      real(kind=8) vresid_out(Nmax)
      real(kind=8) uresid_out(Nmax)
      real(kind=8) main_error_out(Nmax)
      integer iter(Nmax)
      interface
      
            subroutine main(N,Nmax,ctr,u_,v_,P_,P_prime_,mu,ro,Re,ubn,u_&
     &out,v_out,P_out,P_prime_out,cresid_out,vresid_out,uresid_out,main_&
     &error_out,iter) 
                use physics
                integer, intent(IN) :: N
                integer, intent(IN) :: Nmax
                integer, intent(IN) :: ctr
                real(kind=8), intent(IN),dimension(:,:) :: u_
                real(kind=8), intent(IN),dimension(:,:) :: v_
                real(kind=8), intent(IN),dimension(:,:) :: P_
                real(kind=8), intent(IN),dimension(:,:) :: P_prime_
                real(kind=8), intent(IN) :: mu
                real(kind=8), intent(IN) :: ro
                real(kind=8), intent(IN) :: Re
                real(kind=8), intent(IN) :: ubn
                real(kind=8), intent(OUT),dimension(2*N+1,2*N+1) :: u_ou&
     &t
                real(kind=8), intent(OUT),dimension(2*N+1,2*N+1) :: v_ou&
     &t
                real(kind=8), intent(OUT),dimension(N,N) :: P_out
                real(kind=8), intent(OUT),dimension(N,N) :: P_prime_out
                real(kind=8), intent(OUT),dimension(Nmax) :: cresid_out
                real(kind=8), intent(OUT),dimension(Nmax) :: vresid_out
                real(kind=8), intent(OUT),dimension(Nmax) :: uresid_out
                real(kind=8), intent(OUT),dimension(Nmax) :: main_error_&
     &out
                integer, intent(OUT),dimension(Nmax) :: iter
            end subroutine main
      end interface
      call main(N, Nmax, ctr, u_, v_, P_, P_prime_, mu, ro, Re, ubn, u_o&
     &ut, v_out, P_out, P_prime_out, cresid_out, vresid_out, uresid_out,&
     & main_error_out, iter)
      end


      subroutine f2pywrap_linear_tdma (AP1D, AE1D, AW1D, B1D, T1D, N, f2&
     &py_AP1D_d0, f2py_AE1D_d0, f2py_AW1D_d0, f2py_B1D_d0)
      use linear, only : tdma
      integer N
      integer f2py_AP1D_d0
      integer f2py_AE1D_d0
      integer f2py_AW1D_d0
      integer f2py_B1D_d0
      real(kind=8) AP1D(f2py_AP1D_d0)
      real(kind=8) AE1D(f2py_AE1D_d0)
      real(kind=8) AW1D(f2py_AW1D_d0)
      real(kind=8) B1D(f2py_B1D_d0)
      real(kind=8) T1D(N)
      call tdma(AP1D, AE1D, AW1D, B1D, T1D, N)
      end subroutine f2pywrap_linear_tdma
      subroutine f2pywrap_linear_uTDMA_LxL_OLD (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      use linear, only : uTDMA_LxL_OLD
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      call uTDMA_LxL_OLD(AP, AE, AW, AN, AS, B, T, Tprev, NI, NJ, alpha,&
     & flag)
      end subroutine f2pywrap_linear_uTDMA_LxL_OLD
      subroutine f2pywrap_linear_uTDMA_LxL_NEW (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      use linear, only : uTDMA_LxL_NEW
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      call uTDMA_LxL_NEW(AP, AE, AW, AN, AS, B, T, Tprev, NI, NJ, alpha,&
     & flag)
      end subroutine f2pywrap_linear_uTDMA_LxL_NEW
      subroutine f2pywrap_linear_vTDMA_LxL_OLD (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      use linear, only : vTDMA_LxL_OLD
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      call vTDMA_LxL_OLD(AP, AE, AW, AN, AS, B, T, Tprev, NI, NJ, alpha,&
     & flag)
      end subroutine f2pywrap_linear_vTDMA_LxL_OLD
      subroutine f2pywrap_linear_vTDMA_LxL_NEW (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      use linear, only : vTDMA_LxL_NEW
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      call vTDMA_LxL_NEW(AP, AE, AW, AN, AS, B, T, Tprev, NI, NJ, alpha,&
     & flag)
      end subroutine f2pywrap_linear_vTDMA_LxL_NEW
      
      subroutine f2pyinitlinear(f2pysetupfunc)
      interface 
      subroutine f2pywrap_linear_tdma (AP1D, AE1D, AW1D, B1D, T1D, N, f2&
     &py_AP1D_d0, f2py_AE1D_d0, f2py_AW1D_d0, f2py_B1D_d0)
      integer N
      integer f2py_AP1D_d0
      integer f2py_AE1D_d0
      integer f2py_AW1D_d0
      integer f2py_B1D_d0
      real(kind=8) AP1D(f2py_AP1D_d0)
      real(kind=8) AE1D(f2py_AE1D_d0)
      real(kind=8) AW1D(f2py_AW1D_d0)
      real(kind=8) B1D(f2py_B1D_d0)
      real(kind=8) T1D(N)
      end subroutine f2pywrap_linear_tdma 
      subroutine f2pywrap_linear_uTDMA_LxL_OLD (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      end subroutine f2pywrap_linear_uTDMA_LxL_OLD 
      subroutine f2pywrap_linear_uTDMA_LxL_NEW (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      end subroutine f2pywrap_linear_uTDMA_LxL_NEW 
      subroutine f2pywrap_linear_vTDMA_LxL_OLD (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      end subroutine f2pywrap_linear_vTDMA_LxL_OLD 
      subroutine f2pywrap_linear_vTDMA_LxL_NEW (AP, AE, AW, AN, AS, B, T&
     &, Tprev, NI, NJ, alpha, flag, f2py_AP_d0, f2py_AP_d1, f2py_AE_d0, &
     &f2py_AE_d1, f2py_AW_d0, f2py_AW_d1, f2py_AN_d0, f2py_AN_d1, f2py_A&
     &S_d0, f2py_AS_d1, f2py_B_d0, f2py_B_d1, f2py_T_d0, f2py_T_d1, f2py&
     &_Tprev_d0, f2py_Tprev_d1)
      integer NI
      integer NJ
      real(kind=8) alpha
      integer flag
      integer f2py_AP_d0
      integer f2py_AP_d1
      integer f2py_AE_d0
      integer f2py_AE_d1
      integer f2py_AW_d0
      integer f2py_AW_d1
      integer f2py_AN_d0
      integer f2py_AN_d1
      integer f2py_AS_d0
      integer f2py_AS_d1
      integer f2py_B_d0
      integer f2py_B_d1
      integer f2py_T_d0
      integer f2py_T_d1
      integer f2py_Tprev_d0
      integer f2py_Tprev_d1
      real(kind=8) AP(f2py_AP_d0,f2py_AP_d1)
      real(kind=8) AE(f2py_AE_d0,f2py_AE_d1)
      real(kind=8) AW(f2py_AW_d0,f2py_AW_d1)
      real(kind=8) AN(f2py_AN_d0,f2py_AN_d1)
      real(kind=8) AS(f2py_AS_d0,f2py_AS_d1)
      real(kind=8) B(f2py_B_d0,f2py_B_d1)
      real(kind=8) T(f2py_T_d0,f2py_T_d1)
      real(kind=8) Tprev(f2py_Tprev_d0,f2py_Tprev_d1)
      end subroutine f2pywrap_linear_vTDMA_LxL_NEW
      end interface
      external f2pysetupfunc
      call f2pysetupfunc(f2pywrap_linear_tdma,f2pywrap_linear_uTDMA_LxL_&
     &OLD,f2pywrap_linear_uTDMA_LxL_NEW,f2pywrap_linear_vTDMA_LxL_OLD,f2&
     &pywrap_linear_vTDMA_LxL_NEW)
      end subroutine f2pyinitlinear

      subroutine f2pywrap_physics_calcMU (NI, NJ, NJu, velNI, velNJ, ro,&
     & dy, Du, Dv, ubn, Fv, P, tol, Nmax, alpha_u, uresid, u_star, u, Fu&
     &, APu, f2py_Fv_d0, f2py_Fv_d1, f2py_P_d0, f2py_P_d1, f2py_uresid_d&
     &0, f2py_uresid_d1, f2py_u_star_d0, f2py_u_star_d1, f2py_u_d0, f2py&
     &_u_d1, f2py_Fu_d0, f2py_Fu_d1, f2py_APu_d0, f2py_APu_d1)
      use physics, only : calcMU
      integer NI
      integer NJ
      integer NJu
      integer velNI
      integer velNJ
      real(kind=8) ro
      real(kind=8) dy
      real(kind=8) Du
      real(kind=8) Dv
      real(kind=8) ubn
      real(kind=8) tol
      integer Nmax
      real(kind=8) alpha_u
      integer f2py_Fv_d0
      integer f2py_Fv_d1
      integer f2py_P_d0
      integer f2py_P_d1
      integer f2py_uresid_d0
      integer f2py_uresid_d1
      integer f2py_u_star_d0
      integer f2py_u_star_d1
      integer f2py_u_d0
      integer f2py_u_d1
      integer f2py_Fu_d0
      integer f2py_Fu_d1
      integer f2py_APu_d0
      integer f2py_APu_d1
      real(kind=8) Fv(f2py_Fv_d0,f2py_Fv_d1)
      real(kind=8) P(f2py_P_d0,f2py_P_d1)
      real(kind=8) uresid(f2py_uresid_d0,f2py_uresid_d1)
      real(kind=8) u_star(f2py_u_star_d0,f2py_u_star_d1)
      real(kind=8) u(f2py_u_d0,f2py_u_d1)
      real(kind=8) Fu(f2py_Fu_d0,f2py_Fu_d1)
      real(kind=8) APu(f2py_APu_d0,f2py_APu_d1)
      call calcMU(NI, NJ, NJu, velNI, velNJ, ro, dy, Du, Dv, ubn, Fv, P,&
     & tol, Nmax, alpha_u, uresid, u_star, u, Fu, APu)
      end subroutine f2pywrap_physics_calcMU
      subroutine f2pywrap_physics_calcMV (NI, NJ, NIv, velNI, velNJ, ro,&
     & dx, Du, Dv, v, Fu_old, P, tol, Nmax, alpha_v, vresid, v_star, Fv,&
     & APv, f2py_v_d0, f2py_v_d1, f2py_Fu_old_d0, f2py_Fu_old_d1, f2py_P&
     &_d0, f2py_P_d1, f2py_vresid_d0, f2py_vresid_d1, f2py_v_star_d0, f2&
     &py_v_star_d1, f2py_Fv_d0, f2py_Fv_d1, f2py_APv_d0, f2py_APv_d1)
      use physics, only : calcMV
      integer NI
      integer NJ
      integer NIv
      integer velNI
      integer velNJ
      real(kind=8) ro
      real(kind=8) dx
      real(kind=8) Du
      real(kind=8) Dv
      real(kind=8) tol
      integer Nmax
      real(kind=8) alpha_v
      integer f2py_v_d0
      integer f2py_v_d1
      integer f2py_Fu_old_d0
      integer f2py_Fu_old_d1
      integer f2py_P_d0
      integer f2py_P_d1
      integer f2py_vresid_d0
      integer f2py_vresid_d1
      integer f2py_v_star_d0
      integer f2py_v_star_d1
      integer f2py_Fv_d0
      integer f2py_Fv_d1
      integer f2py_APv_d0
      integer f2py_APv_d1
      real(kind=8) v(f2py_v_d0,f2py_v_d1)
      real(kind=8) Fu_old(f2py_Fu_old_d0,f2py_Fu_old_d1)
      real(kind=8) P(f2py_P_d0,f2py_P_d1)
      real(kind=8) vresid(f2py_vresid_d0,f2py_vresid_d1)
      real(kind=8) v_star(f2py_v_star_d0,f2py_v_star_d1)
      real(kind=8) Fv(f2py_Fv_d0,f2py_Fv_d1)
      real(kind=8) APv(f2py_APv_d0,f2py_APv_d1)
      call calcMV(NI, NJ, NIv, velNI, velNJ, ro, dx, Du, Dv, v, Fu_old, &
     &P, tol, Nmax, alpha_v, vresid, v_star, Fv, APv)
      end subroutine f2pywrap_physics_calcMV
      subroutine f2pywrap_physics_calcP (P_prime, ro, dx, dy, Fu, Fv, AP&
     &u, APv, NI, NJ, velNI, velNJ, Nmax, cresid, L, ubn, f2py_P_prime_d&
     &0, f2py_P_prime_d1, f2py_Fu_d0, f2py_Fu_d1, f2py_Fv_d0, f2py_Fv_d1&
     &, f2py_APu_d0, f2py_APu_d1, f2py_APv_d0, f2py_APv_d1, f2py_cresid_&
     &d0, f2py_cresid_d1)
      use physics, only : calcP
      real(kind=8) ro
      real(kind=8) dx
      real(kind=8) dy
      integer NI
      integer NJ
      integer velNI
      integer velNJ
      integer Nmax
      real(kind=8) L
      real(kind=8) ubn
      integer f2py_P_prime_d0
      integer f2py_P_prime_d1
      integer f2py_Fu_d0
      integer f2py_Fu_d1
      integer f2py_Fv_d0
      integer f2py_Fv_d1
      integer f2py_APu_d0
      integer f2py_APu_d1
      integer f2py_APv_d0
      integer f2py_APv_d1
      integer f2py_cresid_d0
      integer f2py_cresid_d1
      real(kind=8) P_prime(f2py_P_prime_d0,f2py_P_prime_d1)
      real(kind=8) Fu(f2py_Fu_d0,f2py_Fu_d1)
      real(kind=8) Fv(f2py_Fv_d0,f2py_Fv_d1)
      real(kind=8) APu(f2py_APu_d0,f2py_APu_d1)
      real(kind=8) APv(f2py_APv_d0,f2py_APv_d1)
      real(kind=8) cresid(f2py_cresid_d0,f2py_cresid_d1)
      call calcP(P_prime, ro, dx, dy, Fu, Fv, APu, APv, NI, NJ, velNI, v&
     &elNJ, Nmax, cresid, L, ubn)
      end subroutine f2pywrap_physics_calcP
      
      subroutine f2pyinitphysics(f2pysetupfunc)
      interface 
      subroutine f2pywrap_physics_calcMU (NI, NJ, NJu, velNI, velNJ, ro,&
     & dy, Du, Dv, ubn, Fv, P, tol, Nmax, alpha_u, uresid, u_star, u, Fu&
     &, APu, f2py_Fv_d0, f2py_Fv_d1, f2py_P_d0, f2py_P_d1, f2py_uresid_d&
     &0, f2py_uresid_d1, f2py_u_star_d0, f2py_u_star_d1, f2py_u_d0, f2py&
     &_u_d1, f2py_Fu_d0, f2py_Fu_d1, f2py_APu_d0, f2py_APu_d1)
      integer NI
      integer NJ
      integer NJu
      integer velNI
      integer velNJ
      real(kind=8) ro
      real(kind=8) dy
      real(kind=8) Du
      real(kind=8) Dv
      real(kind=8) ubn
      real(kind=8) tol
      integer Nmax
      real(kind=8) alpha_u
      integer f2py_Fv_d0
      integer f2py_Fv_d1
      integer f2py_P_d0
      integer f2py_P_d1
      integer f2py_uresid_d0
      integer f2py_uresid_d1
      integer f2py_u_star_d0
      integer f2py_u_star_d1
      integer f2py_u_d0
      integer f2py_u_d1
      integer f2py_Fu_d0
      integer f2py_Fu_d1
      integer f2py_APu_d0
      integer f2py_APu_d1
      real(kind=8) Fv(f2py_Fv_d0,f2py_Fv_d1)
      real(kind=8) P(f2py_P_d0,f2py_P_d1)
      real(kind=8) uresid(f2py_uresid_d0,f2py_uresid_d1)
      real(kind=8) u_star(f2py_u_star_d0,f2py_u_star_d1)
      real(kind=8) u(f2py_u_d0,f2py_u_d1)
      real(kind=8) Fu(f2py_Fu_d0,f2py_Fu_d1)
      real(kind=8) APu(f2py_APu_d0,f2py_APu_d1)
      end subroutine f2pywrap_physics_calcMU 
      subroutine f2pywrap_physics_calcMV (NI, NJ, NIv, velNI, velNJ, ro,&
     & dx, Du, Dv, v, Fu_old, P, tol, Nmax, alpha_v, vresid, v_star, Fv,&
     & APv, f2py_v_d0, f2py_v_d1, f2py_Fu_old_d0, f2py_Fu_old_d1, f2py_P&
     &_d0, f2py_P_d1, f2py_vresid_d0, f2py_vresid_d1, f2py_v_star_d0, f2&
     &py_v_star_d1, f2py_Fv_d0, f2py_Fv_d1, f2py_APv_d0, f2py_APv_d1)
      integer NI
      integer NJ
      integer NIv
      integer velNI
      integer velNJ
      real(kind=8) ro
      real(kind=8) dx
      real(kind=8) Du
      real(kind=8) Dv
      real(kind=8) tol
      integer Nmax
      real(kind=8) alpha_v
      integer f2py_v_d0
      integer f2py_v_d1
      integer f2py_Fu_old_d0
      integer f2py_Fu_old_d1
      integer f2py_P_d0
      integer f2py_P_d1
      integer f2py_vresid_d0
      integer f2py_vresid_d1
      integer f2py_v_star_d0
      integer f2py_v_star_d1
      integer f2py_Fv_d0
      integer f2py_Fv_d1
      integer f2py_APv_d0
      integer f2py_APv_d1
      real(kind=8) v(f2py_v_d0,f2py_v_d1)
      real(kind=8) Fu_old(f2py_Fu_old_d0,f2py_Fu_old_d1)
      real(kind=8) P(f2py_P_d0,f2py_P_d1)
      real(kind=8) vresid(f2py_vresid_d0,f2py_vresid_d1)
      real(kind=8) v_star(f2py_v_star_d0,f2py_v_star_d1)
      real(kind=8) Fv(f2py_Fv_d0,f2py_Fv_d1)
      real(kind=8) APv(f2py_APv_d0,f2py_APv_d1)
      end subroutine f2pywrap_physics_calcMV 
      subroutine f2pywrap_physics_calcP (P_prime, ro, dx, dy, Fu, Fv, AP&
     &u, APv, NI, NJ, velNI, velNJ, Nmax, cresid, L, ubn, f2py_P_prime_d&
     &0, f2py_P_prime_d1, f2py_Fu_d0, f2py_Fu_d1, f2py_Fv_d0, f2py_Fv_d1&
     &, f2py_APu_d0, f2py_APu_d1, f2py_APv_d0, f2py_APv_d1, f2py_cresid_&
     &d0, f2py_cresid_d1)
      real(kind=8) ro
      real(kind=8) dx
      real(kind=8) dy
      integer NI
      integer NJ
      integer velNI
      integer velNJ
      integer Nmax
      real(kind=8) L
      real(kind=8) ubn
      integer f2py_P_prime_d0
      integer f2py_P_prime_d1
      integer f2py_Fu_d0
      integer f2py_Fu_d1
      integer f2py_Fv_d0
      integer f2py_Fv_d1
      integer f2py_APu_d0
      integer f2py_APu_d1
      integer f2py_APv_d0
      integer f2py_APv_d1
      integer f2py_cresid_d0
      integer f2py_cresid_d1
      real(kind=8) P_prime(f2py_P_prime_d0,f2py_P_prime_d1)
      real(kind=8) Fu(f2py_Fu_d0,f2py_Fu_d1)
      real(kind=8) Fv(f2py_Fv_d0,f2py_Fv_d1)
      real(kind=8) APu(f2py_APu_d0,f2py_APu_d1)
      real(kind=8) APv(f2py_APv_d0,f2py_APv_d1)
      real(kind=8) cresid(f2py_cresid_d0,f2py_cresid_d1)
      end subroutine f2pywrap_physics_calcP
      end interface
      external f2pysetupfunc
      call f2pysetupfunc(f2pywrap_physics_calcMU,f2pywrap_physics_calcMV&
     &,f2pywrap_physics_calcP)
      end subroutine f2pyinitphysics


