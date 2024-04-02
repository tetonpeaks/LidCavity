MODULE linear

IMPLICIT NONE

PUBLIC :: tdma, uTDMA_LxL_OLD, uTDMA_LxL_NEW, vTDMA_LxL_OLD, vTDMA_LxL_NEW

CONTAINS

!***************************************************

SUBROUTINE tdma(AP1D,AE1D,AW1D,B1D,T1D,N)

    IMPLICIT NONE

    !Arguements
    INTEGER, INTENT(IN) :: N
    REAL(8), INTENT(INOUT) :: AP1D(:), AE1D(:), AW1D(:), B1D(:)
    REAL(8), INTENT(OUT) :: T1D(N)
    REAL(8) :: r
    INTEGER :: i

    DO i=2,N
        r=AW1D(i)/AP1D(i-1)
        AP1D(i)=AP1D(i)-r*AE1D(i-1)
        B1D(i)=B1D(i)-r*B1D(i-1)
    END DO
    T1D(N)=B1D(N)/AP1D(N)

    DO i=(N-1),1,-1
        T1D(i)=(B1D(i)-AE1D(i)*T1D(i+1))/AP1D(i)

    END DO

END SUBROUTINE tdma

!***************************************************

SUBROUTINE uTDMA_LxL_OLD(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,alpha,flag)

    IMPLICIT NONE
    !Arguments
    INTEGER :: i !Row index
    INTEGER :: j !Column index
    INTEGER, INTENT(IN) :: NI, NJ, flag
    REAL(8), INTENT(IN) :: alpha
    REAL(8), DIMENSION(NI) :: AP1D, AE1D, AW1D, B1D, T1D
    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev

    !West to East
    DO j=1,NJ
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !South to North
    DO i=1,NI
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO

    !East to West
    DO j=NJ,1,-1
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !North to South
    DO i=NI,1,-1
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO
    !WRITE(*,*) ':: HERE @ END OF TDMA_LxL_OLD :: SHAPE() = ', SHAPE(T)

END SUBROUTINE uTDMA_LxL_OLD

SUBROUTINE uTDMA_LxL_NEW(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,alpha,flag)

    IMPLICIT NONE

    !Arguments
    INTEGER :: i !Row index
    INTEGER :: j !Column index
    INTEGER, INTENT(IN) :: NI, NJ, flag
    REAL(8), INTENT(IN) :: alpha
    REAL(8), DIMENSION(NI) :: AP1D, AE1D, AW1D, B1D, T1D
    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev

    !IF (flag == 0) THEN
    !    REAL(KIND), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev
    !ELSE IF (flag == 1) THEN
    !    REAL(KIND), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev
    !END IF


    !East to West
    DO j=NJ,1,-1
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !North to South
    DO i=NI,1,-1
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO

    !West to East
    DO j=1,NJ
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !South to North
    DO i=1,NI
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(j)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO

END SUBROUTINE uTDMA_LxL_NEW

SUBROUTINE vTDMA_LxL_OLD(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,alpha,flag)

    IMPLICIT NONE
    !Arguments
    INTEGER :: i !Row index
    INTEGER :: j !Column index
    INTEGER, INTENT(IN) :: NI, NJ, flag
    REAL(8), INTENT(IN) :: alpha
    REAL(8), DIMENSION(NJ) :: AP1D, AE1D, AW1D, B1D, T1D
    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev

    !West to East
    DO j=1,NJ
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !South to North
    DO i=1,NI
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO

    !East to West
    DO j=NJ,1,-1
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !North to South
    DO i=NI,1,-1
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO
    !WRITE(*,*) ':: HERE @ END OF TDMA_LxL_OLD :: SHAPE() = ', SHAPE(T)

END SUBROUTINE vTDMA_LxL_OLD

SUBROUTINE vTDMA_LxL_NEW(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,alpha,flag)

    IMPLICIT NONE

    !Arguments
    INTEGER :: i !Row index
    INTEGER :: j !Column index
    INTEGER, INTENT(IN) :: NI, NJ, flag
    REAL(8), INTENT(IN) :: alpha
    REAL(8), DIMENSION(NJ) :: AP1D, AE1D, AW1D, B1D, T1D
    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev

    !IF (flag == 0) THEN
    !    REAL(KIND), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev
    !ELSE IF (flag == 1) THEN
    !    REAL(KIND), INTENT(INOUT), DIMENSION(:,:) :: AE, AW, AN, AS, AP, B, T, Tprev
    !END IF


    !East to West
    DO j=NJ,1,-1
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !North to South
    DO i=NI,1,-1
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO

    !West to East
    DO j=1,NJ
        DO i=1,NI
            AP1D(i)=AP(i,j)/alpha
            AE1D(i)=AN(i,j)
            AW1D(i)=AS(i,j)
            B1D(i)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (j > 1) THEN
                B1D(i)=B1D(i)-AW(i,j)*T(i,j-1)
            END IF

            IF (j < NJ) THEN
                B1D(i)=B1D(i)-AE(i,j)*T(i,j+1)
            END IF
        END DO

        DO i=1,NI
            T1D(i)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NI)
        DO i=1,NI
            T(i,j)=T1D(i)
        END DO
    END DO

    !South to North
    DO i=1,NI
        DO j=1,NJ
            AP1D(j)=AP(i,j)/alpha
            AE1D(j)=AE(i,j)
            AW1D(j)=AW(i,j)
            B1D(j)=B(i,j)+((1-alpha)/alpha)*AP(i,j)*Tprev(i,j)

            IF (i > 1) THEN
                B1D(j)=B1D(j)-AS(i,j)*T(i-1,j)
            END IF

            IF (i < NI) THEN
                B1D(j)=B1D(j)-AN(i,j)*T(i+1,j)
            END IF
        END DO

        DO j=1,NJ
            T1D(j)=0.0 !Reset T vector
        END DO

        CALL tdma(AP1D,AE1D,AW1D,B1D,T1D,NJ)
        DO j=1,NJ
            T(i,j)=T1D(j)
        END DO
    END DO

END SUBROUTINE vTDMA_LxL_NEW

END MODULE linear

!********************************************************

MODULE physics
USE linear

IMPLICIT NONE

PUBLIC :: calcMU, calcMV, calcP

CONTAINS

!********************************************************

SUBROUTINE calcMU(NI,NJ,NJu,velNI,velNJ,ro,dy,Du,Dv,ubn,Fv,P,tol,Nmax,alpha_u,uresid,u_star,u,Fu,APu)

    IMPLICIT NONE

    !Arguments
    INTEGER :: NI,NJ,NJu,Nmax,velNI,velNJ

    !Local variables
    INTEGER :: i,j,m,q,k,counteru,NJ_old
    REAL(8) :: Feu,Fwu,Fnu,Fsu,max_erroru,dummy,Hoe,How,Hon,Hos
    REAL(8), DIMENSION(NI,NJ-1) :: AE,AW,AN,AS,B,AP,T,Tprev,T_OLD,T_NEW,Erroru
    REAL(8), DIMENSION(velNI,velNJ) :: Fu_star,Fv_star
    CHARACTER(len=5) :: check

    !Global variables
    REAL(8), INTENT(IN) :: ro,dy,Du,Dv,ubn,tol,alpha_u
    REAL(8), INTENT(IN), DIMENSION(:,:) :: u,Fv,P
    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: u_star,Fu,APu,uresid
    dummy = 1


    DO i=1,NI
        DO j=1,NJ-1
            AE(i,j)=0.0
            AW(i,j)=0.0
            AN(i,j)=0.0
            AS(i,j)=0.0
            AP(i,j)=0.0
            B(i,j)=0.0
        END DO
    END DO

    !u ==> T
    DO i=1,NI
        m=2*i
        DO j=1,NJ-1
            q=2*j+1
            T(i,j)=u(m,q)
        END DO
    END DO

    Tprev=T
    Fu_star=Fu
    Fv_star=Fv

    DO i=1,NI
        m=2*i
        DO j=1,NJ-1
            q=2*j+1
            !Calculate face flow rates
            Feu=Fu_star(m,q+2)+.5*(Fv_star(m+1,q+1)-Fv_star(m-1,q+1))
            Fwu=Fu_star(m,q-2)+.5*(Fv_star(m-1,q-1)-Fv_star(m+1,q-1))
            Fnu=.5*(Fv_star(m+1,q-1)+Fv_star(m+1,q+1))
            Fsu=.5*(Fv_star(m-1,q-1)+Fv_star(m-1,q+1))

            IF (MAX(-Feu,0.0) /= 0.0) THEN !E to W
                check='T'
            ELSE
                check='F'
            END IF

            SELECT CASE (check)
                CASE('T')
                    IF (j == NJ-1) THEN
                        Hoe=0.0 !1st order UDS on boundary
                    ELSE
                        Hoe=.5*(u(m,q)+u(m,q+2))-.125*(u(m,q)+u(m,q+4)-2*u(m,q+2))-u(m,q+2)
                END IF
                CASE('F')
                    Hoe=.5*(u(m,q+2)+u(m,q))-.125*(u(m,q+2)+u(m,q-2)-2*u(m,q))-u(m,q) !E to W
            END SELECT

            IF (MAX(Fwu,0.0) /= 0.0) THEN
                check='T' !W to E
            ELSE
                check='F' !E to W
            END IF

            SELECT CASE (check)
                CASE('T')
                    IF (j==1) THEN
                        How=0.0 !1st order UDS on boundary
                    ELSE
                        How=.5*(u(m,q)+u(m,q-2))-.125*(u(m,q)+u(m,q-4)-2*u(m,q-2))-u(m,q-2)
                    END IF
                CASE('F')
                    How=.5*(u(m,q-2)+u(m,q))-.125*(u(m,q-2)+u(m,q+2)-2*u(m,q))-u(m,q) !E to W
            END SELECT

            IF (MAX(-Fnu,0.0) == 0.0) THEN
                check='T' !S to N
            ELSE
                check='F' !N to S
            END IF

            SELECT CASE (check)
                CASE('T')
                    IF (i==1 .OR. i==NI) THEN
                        Hon=0.0 !1st order UDS and no higher order
                    ELSE
                        Hon=.5*(u(m+2,q)+u(m,q))-.125*(u(m+2,q)+u(m-2,q)-2*u(m,q))-u(m,q)
                    END IF
                CASE('F')
                    IF (i==NI .OR. i==NI-1) THEN
                        Hon=0.0 !no higher order
                    ELSE
                        Hon=.5*(u(m,q)+u(m+2,q))-.125*(u(m,q)+u(m+4,q)-2*u(m+2,q))-u(m+2,q)
                    END IF
            END SELECT

            IF (MAX(Fsu,0.0) == 0.0) THEN
                check='T' !N to S
            ELSE
                check='F' !S to N
            END IF

            SELECT CASE(check)
            CASE('T')
                IF (i==NI .OR. i==1) THEN
                    Hos=0.0 !1st order UDS and nohigher order
                ELSE
                    Hos=.5*(u(m-2,q)+u(m,q))-.125*(u(m-2,q)+u(m+2,q)-2*u(m,q))-u(m,q)
                END IF
                CASE('F')
                IF (i==1 .OR. i==2) THEN
                    Hos=0.0 !no higher UDS
                ELSE
                    Hos=.5*(u(m,q)+u(m-2,q))-.125*(u(m,q)+u(m-4,q)-2*u(m-2,q))-u(m-2,q)
                END IF
            END SELECT

            !Calculuate centroid coefficients
            !East
            AE(i,j)=-(Du+MAX(-Feu,0.0)) !Interior
            !West
            AW(i,j)=-(Du+MAX(Fwu,0.0)) !Interior
            IF (i==NI) THEN
                AN(NI,j)=-2*Dv !North Boundary
            ELSE
                AN(i,j)=-(Du+MAX(-Fnu,0.0)) !North
            END IF
            IF (i==1) THEN
                AS(1,j)=-2*Dv !South Boundary
            ELSE
                AS(i,j)=-(Du+MAX(Fsu,0.0)) !South
            END IF
            AP(i,j)=-1*(AE(i,j)+AW(i,j)+AN(i,j)+AS(i,j))+(Feu-Fwu+Fnu-Fsu)
            AP(i,j)=AP(i,j)/alpha_u
            B(i,j)=dy*(P(i,j)-P(i,j+1))+(1-alpha_u)*AP(i,j)*Tprev(i,j)-Feu*Hoe+Fwu*How-Fnu*Hon+Fsu*Hos
        END DO
    END DO

    !unit=12
    !CLOSE (UNIT=unit, STATUS='KEEP', IOSTAT=ierror)

    !Update source term
    DO j=1,NJ-1
        B(NI,j)=B(NI,j)-AN(NI,j)*ubn !North rest have no-slipcondition
    END DO

    !Residual
    DO i=2,NI-1
        DO j=2,NJ-2
            uresid(i,j)=ABS(AP(i,j)*T(i,j)+AE(i,j)*T(i,j+1)+AW(i,j)*T(i,j-1)+AN(i,j)*T(i+1,j)+AS(i,j)*T(i-1,j)-B(i,j))
            uresid(i,j)=uresid(i,j)/ABS(AP(i,j)*T(i,j))
        END DO
    END DO

    !Set boundary coeffecients to zero
    DO i=1,NI
        AE(i,NJ-1)=0.0
        AW(i,1)=0.0
        END DO
    DO j=1,NJ-1
        AN(NI,j)=0.0
        AS(1,j)=0.0
    END DO

    !Solution loop parameters
    counteru=1
    max_erroru=1.
    NJ_old=NJ
    NJ=NJu
    !TDMA Solver
    DO k=1,Nmax

        !T_OLD
        CALL uTDMA_LxL_OLD(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,dummy,0)
        T_OLD=T
        !T_NEW
        CALL uTDMA_LxL_NEW(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,dummy,0)
        T_NEW=T
        !Error Analysis 2
        Erroru=ABS(T_NEW-T_OLD)
        max_erroru=MAXVAL(Erroru)

        IF (max_erroru < tol) THEN
            !T ==> u, Fu
            DO i=1,NI
                m=2*i
                DO j=1,NJu
                    q=2*j+1
                    u_star(m,q)=T(i,j)
                    Fu(m,q)=ro*dy*u_star(m,q)
                END DO
            END DO
            APu=AP
            EXIT
        END IF
        counteru=counteru+1
    END DO

    NJ=NJ_old
    !WRITE(*,*) 'max_erroru = ',max_erroru
    !WRITE(*,*) 'counteru = ',counteru

END SUBROUTINE calcMU

!********************************************************

SUBROUTINE calcMV(NI,NJ,NIv,velNI,velNJ,ro,dx,Du,Dv,v,Fu_old,P,tol,Nmax,alpha_v,vresid,v_star,Fv,APv)

    IMPLICIT NONE

    !Arguments
    INTEGER :: NI,NJ,NIv,Nmax,velNI,velNJ

    !Local variables
    INTEGER :: i,j,m,q,k,counterv,NI_old
    REAL(8) :: Fev,Fwv,Fnv,Fsv,max_errorv,dummy,Hoe,How,Hon,Hos
    REAL(8), DIMENSION(NI-1,NJ) :: AE,AW,AN,AS,B,AP,T,Tprev,T_OLD,T_NEW,Errorv
    REAL(8), DIMENSION(velNI,velNJ) :: Fu_star,Fv_star
    CHARACTER(len=6) :: check

    !Global variables
    REAL(8), INTENT(IN) :: ro,dx,Du,Dv,tol,alpha_v
    REAL(8), INTENT(IN), DIMENSION(:,:) :: v,Fu_old,P
    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: v_star,Fv,APv,vresid
    dummy=1
    DO i=1,NI-1
        DO j=1,NJ
            AE(i,j)=0.0
            AW(i,j)=0.0
            AN(i,j)=0.0
            AS(i,j)=0.0
            AP(i,j)=0.0
            B(i,j)=0.0
        END DO
    END DO

    !v ==> T
    DO i=1,NI-1
        m=2*i+1
        DO j=1,NJ
            q=2*j
            T(i,j)=v(m,q)
        END DO
    END DO

    Tprev=T
    Fu_star=Fu_old
    Fv_star=Fv

    DO i=1,NI-1
        m=2*i+1
        DO j=1,NJ
            q=2*j
            !Calculate face flow rates
            Fnv=Fv_star(m+2,q)+.5*(Fu_star(m+1,q+1)-Fu_star(m+1,q-1))
            Fsv=Fv_star(m-2,q)+.5*(Fu_star(m-1,q-1)-Fu_star(m-1,q+1))
            Fev=.5*(Fu_star(m+1,q+1)+Fu_star(m-1,q+1))
            Fwv=.5*(Fu_star(m+1,q-1)+Fu_star(m-1,q-1))
            IF (MAX(-Fnv,0.0) /= 0.0) THEN
                check='T' !N to S
            ELSE
                check='F' !S to N
            END IF

            SELECT CASE(check)
                CASE('T')
                    IF (i==NI-1) THEN
                        Hon=0.0 !1st order UDS
                    ELSE
                        Hon=.5*(v(m,q)+v(m+2,q))-.125*(v(m,q)+v(m+4,q)-2*v(m+2,q))-v(m+2,q)
                    END IF
                CASE('F')
                        Hon=.5*(v(m+2,q)+v(m,q))-.125*(v(m+2,q)+v(m-2,q)-2*v(m,q))-v(m,q)
                    END SELECT
                    IF (MAX(Fsv,0.0) /= 0.0) THEN
                        check='T' !S to N
                    ELSE
                        check='F' !N to S
                    END IF

            SELECT CASE(check)
                CASE('T')
                    IF (i==1) THEN
                        Hos=0.0 !1st order UDS
                    ELSE
                        Hos=.5*(v(m,q)+v(m-2,q))-.125*(v(m,q)+v(m-4,q)-2*v(m-2,q))-v(m-2,q)
                    END IF
                CASE('F')
                    Hos=.5*(v(m-2,q)+v(m,q))-.125*(v(m-2,q)+v(m+2,q)-2*v(m,q))-v(m,q)
            END SELECT

            IF (MAX(-Fev,0.0) == 0.0) THEN
                check='T' !W to E
            ELSE
                check='F' !E to W
            END IF

            SELECT CASE(check)
                CASE('T')
                    IF (j==1 .OR. j==NJ) THEN
                        HOe=0.0 !1st order UDS and no higher order
                    ELSE
                        Hoe=.5*(v(m,q+2)+v(m,q))-.125*(v(m,q+2)+v(m,q-2)-2*v(m,q))-v(m,q)
                    END IF
                CASE('F')
                    IF (j==NJ .OR. j==NJ-1) THEN
                        Hoe=0.0 !no higher order
                    ELSE
                        Hoe=.5*(v(m,q)+v(m,q+2))-.125*(v(m,q)+v(m,q+4)-2*v(m,q+2))-v(m,q+2)
                    END IF
            END SELECT

            IF (MAX(Fwv,0.0) == 0.0) THEN
                check='T' !E to W
            ELSE
                check='F' !W to E
            END IF

            SELECT CASE(check)
                CASE('T')
                    IF (j==NJ .OR. j==1) THEN
                        How=0.0 !1st order UDS and no higher order
                    ELSE
                        How=.5*(v(m,q-2)+v(m,q))-.125*(v(m,q-2)+v(m,q+2)-2*v(m,q))-v(m,q)
                    END IF
                CASE('F')
                    IF (j==1 .OR. j==2) THEN
                        How=0.0 !No higher order
                    ELSE
                        How=.5*(v(m,q)+v(m,q-2))-.125*(v(m,q)+v(m,q-4)-2*v(m,q-2))-v(m,q-2)
                    END IF
            END SELECT

            !Calculuate centroid coefficients
            !North
            AN(i,j)=-(Dv+MAX(-Fnv,0.0))
            !South
            AS(i,j)=-(Dv+MAX(Fsv,0.0))
            IF (j==NJ) THEN
                AE(i,j)=-2*Du
            ELSE
                AE(i,j)=-(Du+MAX(-Fev,0.0)) !East
            END IF
            IF (j==1) THEN
                AW(i,j)=-2*Du !West boundary
            ELSE
                AW(i,j)=-(Du+MAX(Fwv,0.0)) !West
            END IF
            AP(i,j)=-1*(AE(i,j)+AW(i,j)+AN(i,j)+AS(i,j))+(Fev-Fwv+Fnv-Fsv)
            AP(i,j)=AP(i,j)/alpha_v
            B(i,j)=dx*(P(i,j)-P(i+1,j))+(1-alpha_v)*AP(i,j)*Tprev(i,j)-Fev*Hoe+Fwv*How-Fnv*Hon+Fsv*Hos
        END DO
    END DO

    !Residual
    DO i=2,NI-2
        DO j=2,NJ-1
        vresid(i,j)=ABS(AP(i,j)*T(i,j)+AE(i,j)*T(i,j+1)+AW(i,j)*T(i,j-1)+AN(i,j)*T(i+1,j)+AS(i,j)*T(i-1,j)-B(i,j))
        vresid(i,j)=vresid(i,j)/ABS(AP(i,j)*T(i,j))
        END DO
    END DO

    !Set boundary coeffecients to zero
    DO i=1,NI-1
        AE(i,NJ)=0.0
        AW(i,1)=0.0
    END DO

    DO j=1,NJ
        AN(NI-1,j)=0.0
        AS(1,j)=0.0
    END DO

    !Solution Loop
    counterv=1
    max_errorv=1.
    NI_old=NI
    NI=NIv

    !Convergence 2
    DO k=1,Nmax

        !T_OLD
        CALL vTDMA_LxL_OLD(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,dummy,1)
        !WRITE(*,*) ':: HERE in VMOM after TDMA_LxL_OLD call ::'
        T_OLD=T
        !T_NEW
        CALL vTDMA_LxL_NEW(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,dummy,1)
        T_NEW=T
        !Error Analysis 2
        Errorv=ABS(T_NEW-T_OLD)
        max_errorv=MAXVAL(Errorv)

        IF (max_errorv < tol) THEN
            !T ==> v, Fv
            DO i=1,NIv
                m=2*i+1
                DO j=1,NJ
                    q=2*j
                    v_star(m,q)=T(i,j)
                    Fv(m,q)=ro*dx*v_star(m,q)
                END DO
            END DO
            APv=AP
            EXIT
        END IF
        counterv=counterv+1
    END DO
    NI=NI_old
    !WRITE(*,*) 'max_errorv = ',max_errorv
    !WRITE(*,*) 'counterv = ',counterv

END SUBROUTINE calcMV

!********************************************************

SUBROUTINE calcP(P_prime,ro,dx,dy,Fu,Fv,APu,APv,NI,NJ,velNI,velNJ,Nmax,cresid,L,ubn)

    IMPLICIT NONE

    !Arguments
    INTEGER :: NI,NJ,Nmax,velNI,velNJ

    !Local variables
    INTEGER :: i,j,m,r,q,s,k,counter2
    REAL(8) :: max_error2,dummy,tolp
    REAL(8), DIMENSION(NI,NJ) ::AE,AW,AN,AS,B,AP,T,T_OLD,T_NEW,Error2,Tprev,de,dw,dn,ds
    REAL(8), DIMENSION(velNI,velNJ) :: Fu_star,Fv_star
    REAL(8), DIMENSION(NI,NJ-1) :: APul
    REAL(8), DIMENSION(NI-1,NJ) :: APvl

    !Global variables
    REAL(8), INTENT(IN) :: ro,dx,dy,L,ubn
    REAL(8), INTENT(IN), DIMENSION(:,:) :: Fu,Fv,APu,APv

    REAL(8), INTENT(INOUT), DIMENSION(:,:) :: P_prime,cresid
    T=P_prime
    Tprev=T
    Fu_star=Fu
    Fv_star=Fv
    APul=APu
    APvl=APv

    DO i=1,NI
        DO j=1,NJ
            AE(i,j)=0.0
            AW(i,j)=0.0
            AS(i,j)=0.0
            AN(i,j)=0.0
            AP(i,j)=0.0
            B(i,j)=0.0
        END DO
    END DO

    !Set underelaxation Parameter = 1
    dummy = 1.0

    !Interior
    DO i=1,NI
        DO j=1,NJ-1
            de(i,j) = dy/APul(i,j)
            AE(i,j)=-ro*de(i,j)*dy !East coefficients
        END DO
    END DO

    DO i=1,NI
        DO j=2,NJ
            dw(i,j) = dy/APul(i,j-1)
            AW(i,j)=-ro*dw(i,j)*dy !West coefficients
        END DO
    END DO

    DO i=1,NI-1
        DO j=1,NJ
            dn(i,j) = dx/APvl(i,j)
            AN(i,j)=-ro*dn(i,j)*dx !North coefficients
        END DO
    END DO

    DO i=2,NI
        DO j=1,NJ
            ds(i,j) = dx/APvl(i-1,j)
            AS(i,j)=-ro*ds(i,j)*dx !South coefficients
        END DO
    END DO

    !Source
    DO i=1,NI
        m=2*i
        q=2*i+1
        DO j=1,NJ
            r=2*j+1
            s=2*j
            B(i,j) = Fu_star(m,r-2) - Fu_star(m,r) + Fv_star(q-2,s)- Fv_star(q,s)
            cresid(i,j)=B(i,j)/(ro*ubn*L)
        END DO
    END DO

    !AP Coefficients
    DO i = 1,NI
        DO j = 1,NJ
            AP(i,j) = -1.0*(AE(i,j) + AW(i,j) + AN(i,j) + AS(i,j))
            !All other nodes
        END DO
    END DO

    AP(NI,NJ) = 1.0
    AE(NI,NJ) = 0.0
    AW(NI,NJ) = 0.0
    AN(NI,NJ) = 0.0
    AS(NI,NJ) = 0.0
    B(NI,NJ) = 0.0

    !Solution Loop
    counter2=1
    max_error2=1.0
    IF (MAXVAL(cresid) < 1E-4 .AND. MAXVAL(cresid) > 1E-5) THEN
        tolp=1E-3
    ELSE IF (MAXVAL(cresid) < 1E-5 .AND. MAXVAL(cresid) > 1E-6) THEN
        tolp=5E-4
    ELSE IF (MAXVAL(cresid) < 1E-6 .AND. MAXVAL(cresid) > 1E-7) THEN
        tolp=1E-4
    ELSE IF (MAXVAL(cresid) < 1E-7) THEN
        tolp=1E-5
    ELSE
        tolp=1E-2
    END IF

    !WRITE(*,*) 'tolp =',tolp

    !Convergence 2
    DO k=1,Nmax

        !T_OLD
        CALL uTDMA_LxL_OLD(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,dummy,2)
        T_OLD=T
        !T_NEW
        CALL uTDMA_LxL_NEW(AP,AE,AW,AN,AS,B,T,Tprev,NI,NJ,dummy,2)
        T_NEW=T
        !Error Analysis 2
        Error2=ABS(T_NEW-T_OLD)
        max_error2=MAXVAL(Error2)

        IF (max_error2 < tolp) THEN
            P_prime=T
            EXIT
        END IF
    END DO
    !WRITE(*,*) 'max_error2 = ',max_error2

END SUBROUTINE calcP

!********************************************************

END MODULE physics

!********************************************************

SUBROUTINE main(N,Nmax,ctr,u_,v_,P_,P_prime_,mu,ro,Re,ubn,&
    u_out,v_out,P_out,P_prime_out,&
    cresid_out,vresid_out,uresid_out,main_error_out,iter)
USE physics

IMPLICIT NONE

INTEGER, INTENT(IN) :: N, Nmax, ctr
INTEGER :: NmaxFxn,NI,NJ,NIv,NJu,velNI,velNJ,unit,ierror
CHARACTER(len=16) :: filename
INTEGER :: k,i,j,m,r,q,s
REAL(8) :: L,dx,dy,tol,alpha_u,alpha_v,alpha_p,dummy,counter,Bmax,main_error
REAL(8) :: Du,Dv
REAL(8), INTENT(IN) :: mu, ro, ubn, Re
REAL(8), INTENT(IN), DIMENSION(:,:) :: P_, P_prime_
REAL(8), ALLOCATABLE, DIMENSION(:,:) :: APu,APv,u_prime,v_prime,uresid,vresid,cont,P,P_prime,cresid
REAL(8), INTENT(IN), DIMENSION(:,:) :: u_, v_
REAL(8), ALLOCATABLE, DIMENSION(:,:) :: u,u_star,v,v_star,Fu,Fv,Fu_old,Fv_old
REAL(8), ALLOCATABLE, DIMENSION(:) :: x
REAL(8), ALLOCATABLE, DIMENSION(:) :: y
REAL(8), INTENT(OUT), DIMENSION(Nmax) :: main_error_out,uresid_out,vresid_out,cresid_out
INTEGER, INTENT(OUT), DIMENSION(Nmax) :: iter
REAL(8), INTENT(OUT), DIMENSION(N,N) :: P_out,P_prime_out
REAL(8), INTENT(OUT), DIMENSION(2*N+1,2*N+1) :: u_out,v_out

!Boundary conditions
L=Re*mu/(ro*ubn)

!Mesh properties
!N=40
NI=N
NJ=N
velNI=2*NI+1
velNJ=2*NJ+1
NJu=NJ-1
NIv=NI-1
dx=L/REAL(NJ)
dy=L/REAL(NI)

!write(*,*) '** N =', N, ' :: dx =', dx, ' :: dy =', dy

!Loop properties
tol=1E-7
NmaxFxn=50000
alpha_p=0.15
alpha_u=1.-alpha_p
alpha_v=1.-alpha_p
dummy=1
counter=1

!Diffusion coefficients
Du=mu*dy/dx
DV=mu*dx/dy

!WRITE(*,*) '------======Re=',Re,'======------'
!WRITE(*,*) '------======L=',L,'======------'
!WRITE(*,*) '------======dx=',dx,'======------'
ALLOCATE (APu(NJ,NI-1),APv(NI-1,NJ),u(velNI,velNJ),u_prime(NI,NJ-1),u_star(velNI,velNJ),v(velNI,velNJ),v_prime(NI-1,NJ))
ALLOCATE (cont(NI,NJ),v_star(velNI,velNJ),P(NI,NJ),P_prime(NI,NJ),Fu(velNI,velNJ),Fv(velNI,velNJ),Fu_old(velNI,velNJ))
ALLOCATE (uresid(NI,NJ-1),vresid(NI-1,NJ),cresid(NI,NJ))
ALLOCATE (Fv_old(velNI,velNJ),x(velNI),y(velNJ))

DO i=1,velNI
    x(i) = 0.0
END DO

DO j=1,velNJ
    y(j) = 0.0
END DO

DO i=1,velNI
    DO j=1,velNJ
        u(i,j) = 0.0
        u_star(i,j) = 0.0
        v(i,j) = 0.0
        v_star(i,j) = 0.0
        Fu(i,j) = 0.0
        Fv(i,j) = 0.0
        Fu_old(i,j) = 0.0
        Fv_old(i,j) = 0.0
    END DO
END DO

DO i=1,NI
    DO j=1,NJ
        cont(i,j) = 0.0
        P(i,j) = 0.0
        P_prime(i,j) = 0.0
    END DO
END DO

DO i=1,NI
    DO j=1,NJ-1
        APu(i,j) = 0.0
        u_prime(i,j) = 0.0
        uresid(i,j) = 0.0
    END DO
END DO

DO i=1,NI-1
    DO j=1,NJ
        APv(i,j) = 0.0
        v_prime(i,j) = 0.0
        vresid(i,j) = 0.0
    END DO
END DO

IF (ctr > 0) THEN
    u = u_
    v = v_
    !WRITE(*,*) 'In if statement** :: ', P_prime(1,1)
    P_prime = P_prime_
    P = P_
    !WRITE(*,*) P_prime(1,1)
END IF

!Top plate boundary condition
DO j=1,velNJ
    u(velNI,j)=ubn
    u_star(velNI,j)=ubn
END DO

!Find mass flow rates
DO i=1,velNI
    DO j=1,velNJ
        Fu(i,j)=ro*dy*u(i,j)
        Fv(i,j)=ro*dx*v(i,j)
    END DO
END DO

!Generate mesh
x(1)=0.0
DO i=2,velNI
    x(i)=x(i-1)+.5*dx
END DO

y(1)=0.0
DO i=2,velNJ
    y(i)=y(i-1)+.5*dy
END DO


!Start main loop
DO k=1,Nmax
    Fu_old=Fu
    Fv_old=Fv

    !Call u_mom subroutine
    CALL calcMU(NI,NJ,NJu,velNI,velNJ,ro,dy,Du,Dv,ubn,Fv,P,tol,NmaxFxn,alpha_u,uresid,u_star,u,Fu,APu)

    !Call v_mom subroutine
    CALL calcMV(NI,NJ,NIv,velNI,velNJ,ro,dx,Du,Dv,v,Fu_old,P,tol,NmaxFxn,alpha_v,vresid,v_star,Fv,APv)

    !Call pressure correction subroutine
    CALL calcP(P_prime,ro,dx,dy,Fu,Fv,APu,APv,NI,NJ,velNI,velNJ,NmaxFxn,cresid,L,ubn)

    !iterate on u centroids
    !Correct u
    DO i=1,NI
        m=2*i
        DO j=1,NJ-1
            q=2*j+1
            u_prime(i,j)=(dy/APu(i,j))*(P_prime(i,j)-P_prime(i,j+1))
            u(m,q)=u_star(m,q)+u_prime(i,j)
            Fu(m,q)=ro*dy*u(m,q)
        END DO
    END DO

    !iterate on v centroids
    !Correct v
    DO i=1,NI-1
        m=2*i+1
        DO j=1,NJ
            q=2*j
            v_prime(i,j)=(dx/APv(i,j))*(P_prime(i,j)-P_prime(i+1,j))
            v(m,q)=v_star(m,q)+v_prime(i,j)
            Fv(m,q)=ro*dx*v(m,q)
        END DO
    END DO

    !Correct p
    DO i=1,NI
        DO j=1,NJ
            P(i,j)=P(i,j)+alpha_p*P_prime(i,j)
        END DO
    END DO
    P(NI,NJ)=0

    DO i=1,NI
        m=2*i
        q=2*i+1
        DO j=1,NJ
            r=2*j+1
            s=2*j
            cont(i,j) = Fu(m,r-2) - Fu(m,r) + Fv(q-2,s) - Fv(q,s) !Int W and NBoundaries
        END DO
    END DO

    !WRITE(*,*) '-----======uresid = ',MAXVAL(ABS(uresid)),' ======------'
    !WRITE(*,*) '-----======vresid = ',MAXVAL(ABS(vresid)),' ======------'
    !WRITE(*,*) '-----======cresid = ',MAXVAL(ABS(cresid)),' =======------'
    iter(k) = k
    main_error=(MAXVAL(cresid)+MAXVAL(ABS(uresid))+MAXVAL(ABS(vresid)))
    main_error_out(k) = main_error
    uresid_out(k) = MAXVAL(uresid)
    vresid_out(k) = MAXVAL(vresid)
    cresid_out(k) = MAXVAL(cresid)
    !WRITE(*,*) '------======Main Error = ',main_error,' ======-----'
    !WRITE(*,*) 'k = ',k
    u_out = u
    v_out = v
    P_prime_out = P_prime
    P_out = P

    IF ((main_error < 1E-2 .AND. k /= 1) .OR. k == Nmax) THEN
        IF (main_error < 1E-2) THEN
            !WRITE(*,*) 'CONVERGED ?!?!?!?!??!?!?!'
        END IF

        DEALLOCATE (APu,APv,u,u_prime,u_star,v_prime)
        DEALLOCATE (cont,v_star,P,P_prime,Fu,Fv,Fu_old)
        DEALLOCATE (uresid,vresid,cresid)
        DEALLOCATE (Fv_old,x,y)

        EXIT
    END IF
END DO

END SUBROUTINE main