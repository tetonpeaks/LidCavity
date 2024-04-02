module arrays

  implicit none

  public :: r8vec_linspace

  contains

  subroutine r8vec_linspace ( n, a, b, x )

    !*****************************************************************************80
    !
    !! R8VEC_LINSPACE creates a vector of linearly spaced values.
    !
    !  Discussion:
    !
    !    An R8VEC is a vector of R8's.
    !
    !    4 points evenly spaced between 0 and 12 will yield 0, 4, 8, 12.
    !
    !    In other words, the interval is divided into N-1 even subintervals,
    !    and the endpoints of intervals are used as the points.
    !
    !  Licensing:
    !
    !    This code is distributed under the GNU LGPL license.
    !
    !  Modified:
    !
    !    14 March 2011
    !
    !  Author:
    !
    !    John Burkardt
    !
    !  Parameters:
    !
    !    Input, integer ( kind = 4 ) N, the number of entries in the vector.
    !
    !    Input, real ( kind = 8 ) A, B, the first and last entries.
    !
    !    Output, real ( kind = 8 ) X(N), a vector of linearly spaced data.
    !
      implicit none

      integer ( kind = 4 ) n

      real ( kind = 8 ) a
      real ( kind = 8 ) b
      integer ( kind = 4 ) i
      real ( kind = 8 ) x(n)

      if ( n == 1 ) then

        x(1) = ( a + b ) / 2.0D+00

      else

        do i = 1, n
          x(i) = ( real ( n - i,     kind = 8 ) * a   &
                 + real (     i - 1, kind = 8 ) * b ) &
                 / real ( n     - 1, kind = 8 )
        end do

      end if

      return
    end
end module arrays

module interp

  implicit none

  public :: r8_huge, r8vec_bracket5, pwl_interp_2D

  contains

  function r8_huge ( )

  !*****************************************************************************80
  !
  !! R8_HUGE returns a very large R8.
  !
  !  Discussion:
  !
  !    The value returned by this function is intended to be the largest
  !    representable real value.
  !
  !    FORTRAN90 provides a built-in routine HUGE ( X ) that
  !    can return the maximum representable number of the same datatype
  !    as X, if that is what is really desired.
  !
  !  Licensing:
  !
  !    This code is distributed under the GNU LGPL license.
  !
  !  Modified:
  !
  !    27 September 2014
  !
  !  Author:
  !
  !    John Burkardt
  !
  !  Parameters:
  !
  !    Output, real ( kind = 8 ) R8_HUGE, a "huge" value.
  !
    implicit none

    real ( kind = 8 ) r8_huge

    r8_huge = 1.79769313486231571D+308

    return
  end

  function r8vec_bracket5 ( nd, xd, xi )

    !*****************************************************************************80
    !
    !! R8VEC_BRACKET5 brackets data between successive entries of a sorted R8VEC.
    !
    !  Discussion:
    !
    !    We assume XD is sorted.
    !
    !    If XI is contained in the interval [XD(1),XD(N)], then the returned
    !    value B indicates that XI is contained in [ XD(B), XD(B+1) ].
    !
    !    If XI is not contained in the interval [XD(1),XD(N)], then B = -1.
    !
    !    This code implements a version of binary search which is perhaps more
    !    understandable than the usual ones.
    !
    !  Licensing:
    !
    !    This code is distributed under the GNU LGPL license.
    !
    !  Modified:
    !
    !    14 October 2012
    !
    !  Author:
    !
    !    John Burkardt
    !
    !  Parameters:
    !
    !    Input, integer ( kind = 4 ) ND, the number of data values.
    !
    !    Input, real ( kind = 8 ) XD(N), the sorted data.
    !
    !    Input, real ( kind = 8 ) XD, the query value.
    !
    !    Output, integer ( kind = 4 ) R8VEC_BRACKET5, the bracket information.
    !
      implicit none

      integer ( kind = 4 ) nd

      integer ( kind = 4 ) b
      integer ( kind = 4 ) l
      integer ( kind = 4 ) m
      integer ( kind = 4 ) r
      integer ( kind = 4 ) r8vec_bracket5
      real ( kind = 8 ) xd(nd)
      real ( kind = 8 ) xi

      if ( xi < xd(1) .or. xd(nd) < xi ) then

        b = -1

      else

        l = 1
        r = nd

        do while ( l + 1 < r )
          m = ( l + r ) / 2
          if ( xi < xd(m) ) then
            r = m
          else
            l = m
          end if
        end do

        b = l

      end if

      r8vec_bracket5 = b

      return
    end

  subroutine pwl_interp_2D ( nxd, nyd, xd, yd, zd, ni, xi, yi, zi )

  !*****************************************************************************80
  !
  !! PWL_INTERP_2D: piecewise linear interpolant to data defined on a 2D grid.
  !
  !  Discussion:
  !
  !    Thanks to Adam Hirst for pointing out an error in the formula that
  !    chooses the interpolation triangle, 04 February 2018.
  !
  !  Licensing:
  !
  !    This code is distributed under the GNU LGPL license.
  !
  !  Modified:
  !
  !    04 February 2018
  !
  !  Author:
  !
  !    John Burkardt
  !
  !  Parameters:
  !
  !    Input, integer NXD, NYD, the number of X and Y data values.
  !
  !    Input, real ( kind = rk ) XD(NXD), YD(NYD), the sorted X and Y data.
  !
  !    Input, real ( kind = rk ) ZD(NXD,NYD), the Z data.
  !
  !    Input, integer NI, the number of interpolation points.
  !
  !    Input, real ( kind = rk ) XI(NI), YI(NI), the coordinates of the
  !    interpolation points.
  !
  !    Output, real ( kind = rk ) ZI(NI), the value of the interpolant.
  !
    implicit none

    integer, parameter :: rk = kind ( 1.0D+00 )

    integer ni
    integer nxd
    integer nyd

    real ( kind = rk ) alpha
    real ( kind = rk ) beta
    real ( kind = rk ) det
    real ( kind = rk ) dxa
    real ( kind = rk ) dxb
    real ( kind = rk ) dxi
    real ( kind = rk ) dya
    real ( kind = rk ) dyb
    real ( kind = rk ) dyi
    real ( kind = rk ) gamma
    integer i
    integer j
    integer k
    !real ( kind = rk ) r8_huge
    !integer r8vec_bracket5
    real ( kind = rk ) xd(nxd)
    real ( kind = rk ) xi(ni)
    real ( kind = rk ) yd(nyd)
    real ( kind = rk ) yi(ni)
    real ( kind = rk ) zd(nxd,nyd)
    real ( kind = rk ) zi(ni)

    do k = 1, ni
  !
  !  For interpolation point (xi(k),yi(k)), find data intervals I and J so that:
  !
  !    xd(i) <= xi(k) <= xd(i+1),
  !    yd(j) <= yi(k) <= yd(j+1).
  !
  !  But if the interpolation point is not within a data interval,
  !  assign the dummy interpolant value zi(k) = infinity.
  !
      i = r8vec_bracket5 ( nxd, xd, xi(k) )
      if ( i == -1 ) then
        zi(k) = r8_huge ( )
        cycle
      end if

      j = r8vec_bracket5 ( nyd, yd, yi(k) )
      if ( j == -1 ) then
        zi(k) = r8_huge ( )
        cycle
      end if
  !
  !  The rectangular cell is arbitrarily split into two triangles.
  !  The linear interpolation formula depends on which triangle
  !  contains the data point.
  !
  !    (I,J+1)--(I+1,J+1)
  !      |\       |
  !      | \      |
  !      |  \     |
  !      |   \    |
  !      |    \   |
  !      |     \  |
  !    (I,J)---(I+1,J)
  !
      if ( yi(k) < yd(j+1) &
        + ( yd(j) - yd(j+1) ) * ( xi(k) - xd(i) ) / ( xd(i+1) - xd(i) ) ) then

        dxa = xd(i+1) - xd(i)
        dya = yd(j)   - yd(j)

        dxb = xd(i)   - xd(i)
        dyb = yd(j+1) - yd(j)

        dxi = xi(k)   - xd(i)
        dyi = yi(k)   - yd(j)

        det = dxa * dyb - dya * dxb

        alpha = ( dxi * dyb - dyi * dxb ) / det
        beta =  ( dxa * dyi - dya * dxi ) / det
        gamma = 1.0D+00 - alpha - beta

        zi(k) = alpha * zd(i+1,j) + beta * zd(i,j+1) + gamma * zd(i,j)

      else

        dxa = xd(i)   - xd(i+1)
        dya = yd(j+1) - yd(j+1)

        dxb = xd(i+1) - xd(i+1)
        dyb = yd(j)   - yd(j+1)

        dxi = xi(k)   - xd(i+1)
        dyi = yi(k)   - yd(j+1)

        det = dxa * dyb - dya * dxb

        alpha = ( dxi * dyb - dyi * dxb ) / det
        beta =  ( dxa * dyi - dya * dxi ) / det
        gamma = 1.0D+00 - alpha - beta

        zi(k) = alpha * zd(i,j+1) + beta * zd(i+1,j) + gamma * zd(i+1,j+1)

      end if

    end do

    return
  end subroutine pwl_interp_2D

end module interp

module integrate

  implicit none

  public :: rk4Interp

  contains

  subroutine rk4Interp(Nint, h, velNI, velNJ, x, y, u, v, Np, xi, yi, xx, yy, x_out, y_out)
    use interp

    implicit none

    integer, parameter :: rk = kind ( 1.0D+00 )

    integer :: velNI, velNJ, i, j, Np, Nint
    real(kind=rk) :: h
    real(kind=rk), dimension(Np) :: xi, yi, xx, yy, ui, vi, k1x, k2x, k3x, k4x, k1y, k2y, k3y, k4y
    real(kind=rk), dimension(velNI) :: x, y
    real(kind=rk), dimension(velNI, velNJ) :: u, v
    real(kind=rk), dimension(Np, Nint) :: x_out, y_out

    !WRITE(*,*) 'Hello from rk4!'

    do j = 1,Np
      xx = xi
      yy = yi
      do i = 1,Nint
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(u), Np, xx, yy, ui )
        k1x = h*ui
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(u), Np, xx+0.5*k1x, yy+0.5*k1x, ui )
        k2x = h*ui
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(u), Np, xx+0.5*k2x, yy+0.5*k2x, ui )
        k3x = h*ui
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(u), Np, xx+k3x, yy+k3x, ui )
        k4x = h*ui

        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(v), Np, xx, yy, vi )
        k1y = h*vi
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(v), Np, xx+0.5*k1y, yy+0.5*k1y, vi )
        k2y = h*vi
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(v), Np, xx+0.5*k2y, yy+0.5*k2y, vi )
        k3y = h*vi
        call pwl_interp_2D ( velNI, velNJ, x, y, transpose(v), Np, xx+k3y, yy+k3y, vi )
        k4y = h*vi

        xx = xx + (1.0/6.0)*(k1x+2.0*k2x+2.0*k3x+k4x)
        if (xx(j) > 1) then
          !write(*,*) 'in second if x'
          xx = 1.5
        end if

        yy = yy + (1.0/6.0)*(k1y+2.0*k2y+2.0*k3y+k4y)
        if (yy(j) > 1) then
          !write(*,*) 'in second if y'
          yy = 1.5
        end if
        !write(*,*) ':: xx(j) =', xx(j), ' :: yy(j) =', yy(j)
        x_out(j,i) = xx(j)
        y_out(j,i) = yy(j)
      end do
        !write(*,*) ":: xx =", xx(j), " :: yy =", yy(j)
    end do

  end subroutine rk4Interp

end module integrate

subroutine main(N, Np, Nint, u, v, xi, yi, &
   x_out, y_out)
  use arrays
  use interp
  use integrate

  implicit none

  integer, parameter :: rk = kind ( 1.0D+00 )

  integer :: ierror, NI, NJ, velNI, velNJ, i, j
  real(kind=rk) :: dx, dy, h
  real(kind=rk), allocatable, dimension(:) :: x, y, t_span, xx, yy
  character(len=16) :: filename

  integer, intent(in) :: N, Np, Nint
  real(kind=8), intent(in), dimension(:) :: xi, yi
  !real(kind=8), intent(in), dimension(:) :: XXX, YYY
  real(kind=8), intent(in), dimension(:,:) :: u, v
  !real(kind=8), intent(in) :: L
  real(kind=rk) :: L
  real(kind=8), intent(out), dimension(Np, Nint) :: x_out, y_out

  L=1.0
  !L = (Re*mu)/(ro*ubn)

  !N = 20
  NI = N
  NJ = N
  velNI = 2*NI+1
  velNJ = 2*NJ+1
  dx=L/REAL(NJ)
  dy=L/REAL(NI)

  !Np = 1

  allocate (x(velNI), y(velNJ))
  allocate (xx(Np), yy(Np))

  !write(*,*) "Hello World!"
  !write(*,*) ':: u(velNI,velNJ) =', u(velNI,velNJ), ':: v(2,2) =', v(2,2)

  !DO i=1,velNI
  !  x(i) = 0.0
  !END DO
!
  !DO j=1,velNJ
  !  y(j) = 0.0
  !END DO

  DO i=1,velNI
    x(i) = 0
    !x(i) = XXX(i)
  END DO

  DO j=1,velNJ
    y(j) = 0
    !y(j) = YYY(j)
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

  !xi = 0.8
  !yi = 0.8
  !write(*,*) ":: xi =", xi, " :: yi =", yi, " :: Np =", Np
  !Nint = 500
  allocate (t_span(Nint))

  !call r8vec_linspace ( Nint, real(0.0, 8), REAL(1.45, 8), t_span )
  call r8vec_linspace ( Nint, real(0, 8), REAL(1.45, 8), t_span )
  h = t_span(2) - t_span(1)
  !write(*,*) ':: t_span(Nint) =', t_span(Nint), ' :: h =', h


  call rk4Interp(Nint, h, velNI, velNJ, x, y, u, v, Np, xi, yi, xx, yy, x_out, y_out)
  !write(*,*) ':: xx =', xx
  !write(*,*) ':: yy =', yy
  !write(*,*) ':: x(velNI,velNJ) =', x_out, ':: y(velNI,velNJ) =', y_out, ' :: XXX =', XXX(40)
  !write(*,*) ':: L =', L

  deallocate(x, y)

  return
end subroutine main