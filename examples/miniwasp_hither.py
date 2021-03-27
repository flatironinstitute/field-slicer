import hither as hi
import kachery_p2p as kp
import numpy as np

@hi.function('miniwasp_hither', '0.1.0')
@hi.container('docker://magland/miniwasp:0.1.0')
def miniwasp_hither(geom_uri):
    import mwaspbie as mw
    geom_fname = kp.load_file(geom_uri, dest='./lens_r01.go3')

    # geom_fname = './lens_r01.go3'
    n_components = 1

    # compute number of patches and points
    print('em_solver_wrap_mem')
    npatches,npts = mw.em_solver_wrap_mem(geom_fname + '?', n_components)

    # solve analytic test problem. Change icase=2 for plane wave
    # scattering problem
    icase = 1 

    # define direction and polarization of plane wave (needed
    # both for analytic test and scattering problem)

    direction = np.zeros(2)
    pol = np.zeros(2,dtype='complex')
    direction[0] = 0.0
    direction[1] = np.pi/2
    pol[0] = 3.0 
    pol[1] = 3.0

    # Set translation and scaling of each component
    dP = np.zeros((4,n_components),order="F")
    dP[3,0] = 1.0

    # set wave number of problem, should be consistent with
    # the units of prescribed geometry

    # currently set to wave length of green light*6 (for faster run time)
    omega = np.pi*2/300.0

    # set material parameters on either side of each component
    contrast_matrix = np.zeros((4,n_components),order="F",dtype="complex")
    contrast_matrix[0:4,0] = [1.1,1.1,1.2,1.0]


    eps = 1e-3
    # Get geometry info
    print('em_solver_open_geom')
    [npatches_vect,npts_vect,norders,ixyzs,iptype,srcvals,srccoefs,wts,
    sorted_vector,exposed_surfaces] = mw.em_solver_open_geom(geom_fname,dP,npatches,npts,eps)

    #
    #  Set points per wavelength in each direction 
    #  for target grid
    #
    ppw = 5 * 2


    #
    # create target grid
    #

    xmin = np.min(srcvals[0,:])
    xmax = np.max(srcvals[0,:])

    ymin = np.min(srcvals[1,:])
    ymax = np.max(srcvals[1,:])

    zmin = np.min(srcvals[2,:])
    zmax = np.max(srcvals[2,:])

    dx = xmax-xmin
    dy = ymax-ymin
    dz = zmax-zmin

    # determine grid spacing to get the correct 
    # resolution in each dimension of target grid
    nx = int(np.ceil((xmax-xmin)*omega/2/np.pi*ppw))
    ny = int(np.ceil((ymax-ymin)*omega/2/np.pi*ppw))
    nz = int(np.ceil((zmax-zmin)*omega/2/np.pi*ppw))

    xs = np.linspace(xmin+0.1*dx,xmax-0.1*dx,nx)
    ys = np.linspace(ymin+0.1*dy,ymax-0.1*dy,ny)
    zs = np.linspace(zmin+0.1*dz,zmax-0.1*dz,nz)
    xx,yy,zz = np.meshgrid(xs,ys,zs)

    nt = nx*ny*nz
    targs = np.zeros((3,nt),order="F")
    targs[0,:] = xx.reshape(nt)
    targs[1,:] = yy.reshape(nt)
    targs[2,:] = zz.reshape(nt) 

    #
    # Compute analytic solution at targets
    #
    print('em_sol_exact')
    E_ex,H_ex = mw.em_sol_exact(geom_fname,dP,contrast_matrix,npts,omega,eps,direction,pol,targs)

    E_ex = E_ex.reshape((3, nx, ny, nz))
    H_ex = H_ex.reshape((3, nx, ny, nz))

    # return E_ex, H_ex
    return E_ex.shape