# Ported from Stefan Gustavson's java implementation
# http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
# Read Stefan's excellent paper for details on how this code works.
#
# Sean McCullough banksean@gmail.com

###
You can pass in a random number generator object if you like.
It is assumed to have a random() method.
###
window.ClassicalNoise = (r) -> # Classic Perlin noise in 3D, for comparison
  r ?= Math
  @grad3 = [
    [1,1,0]
    [-1,1,0]
    [1,-1,0]
    [-1,-1,0]
    [1,0,1]
    [-1,0,1]
    [1,0,-1]
    [-1,0,-1]
    [0,1,1]
    [0,-1,1]
    [0,1,-1]
    [0,-1,-1]
  ]
  @p = []
  i = 0

  while i < 256
    @p[i] = Math.floor(r.random() * 256)
    i++
  
  # To remove the need for index wrapping, double the permutation table length 
  @perm = []
  i = 0

  while i < 512
    @perm[i] = @p[i & 255]
    i++
  return

ClassicalNoise::dot = (g, x, y, z) ->
  g[0] * x + g[1] * y + g[2] * z

ClassicalNoise::mix = (a, b, t) ->
  (1.0 - t) * a + t * b

ClassicalNoise::fade = (t) ->
  t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


# Classic Perlin noise, 3D version 
ClassicalNoise::noise = (x, y, z) ->
  
  # Find unit grid cell containing point 
  X = Math.floor(x)
  Y = Math.floor(y)
  Z = Math.floor(z)
  
  # Get relative xyz coordinates of point within that cell 
  x = x - X
  y = y - Y
  z = z - Z
  
  # Wrap the integer cells at 255 (smaller integer period can be introduced here) 
  X = X & 255
  Y = Y & 255
  Z = Z & 255
  
  # Calculate a set of eight hashed gradient indices 
  gi000 = @perm[X + @perm[Y + @perm[Z]]] % 12
  gi001 = @perm[X + @perm[Y + @perm[Z + 1]]] % 12
  gi010 = @perm[X + @perm[Y + 1 + @perm[Z]]] % 12
  gi011 = @perm[X + @perm[Y + 1 + @perm[Z + 1]]] % 12
  gi100 = @perm[X + 1 + @perm[Y + @perm[Z]]] % 12
  gi101 = @perm[X + 1 + @perm[Y + @perm[Z + 1]]] % 12
  gi110 = @perm[X + 1 + @perm[Y + 1 + @perm[Z]]] % 12
  gi111 = @perm[X + 1 + @perm[Y + 1 + @perm[Z + 1]]] % 12
  
  # The gradients of each corner are now: 
  # g000 = grad3[gi000]; 
  # g001 = grad3[gi001]; 
  # g010 = grad3[gi010]; 
  # g011 = grad3[gi011]; 
  # g100 = grad3[gi100]; 
  # g101 = grad3[gi101]; 
  # g110 = grad3[gi110]; 
  # g111 = grad3[gi111]; 
  # Calculate noise contributions from each of the eight corners 
  n000 = @dot(@grad3[gi000], x, y, z)
  n100 = @dot(@grad3[gi100], x - 1, y, z)
  n010 = @dot(@grad3[gi010], x, y - 1, z)
  n110 = @dot(@grad3[gi110], x - 1, y - 1, z)
  n001 = @dot(@grad3[gi001], x, y, z - 1)
  n101 = @dot(@grad3[gi101], x - 1, y, z - 1)
  n011 = @dot(@grad3[gi011], x, y - 1, z - 1)
  n111 = @dot(@grad3[gi111], x - 1, y - 1, z - 1)
  
  # Compute the fade curve value for each of x, y, z 
  u = @fade(x)
  v = @fade(y)
  w = @fade(z)
  
  # Interpolate along x the contributions from each of the corners 
  nx00 = @mix(n000, n100, u)
  nx01 = @mix(n001, n101, u)
  nx10 = @mix(n010, n110, u)
  nx11 = @mix(n011, n111, u)
  
  # Interpolate the four results along y 
  nxy0 = @mix(nx00, nx10, v)
  nxy1 = @mix(nx01, nx11, v)
  
  # Interpolate the two last results along z 
  nxyz = @mix(nxy0, nxy1, w)
  nxyz


# Ported from Stefan Gustavson's java implementation
# http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
# Read Stefan's excellent paper for details on how this code works.
#
# Sean McCullough banksean@gmail.com

###
You can pass in a random number generator object if you like.
It is assumed to have a random() method.
###
SimplexNoise = (r) ->
  r = Math  if r is `undefined`
  @grad3 = [
    [1,1,0]
    [-1,1,0]
    [1,-1,0]
    [-1,-1,0]
    [1,0,1]
    [-1,0,1]
    [1,0,-1]
    [-1,0,-1]
    [0,1,1]
    [0,-1,1]
    [0,1,-1]
    [0,-1,-1]
  ]
  @p = []
  i = 0

  while i < 256
    @p[i] = Math.floor(r.random() * 256)
    i++
  
  # To remove the need for index wrapping, double the permutation table length 
  @perm = []
  i = 0

  while i < 512
    @perm[i] = @p[i & 255]
    i++
  
  # A lookup table to traverse the simplex around a given point in 4D. 
  # Details can be found where this table is used, in the 4D noise method. 
  @simplex = [
    [0,1,2,3]
    [0,1,3,2]
    [0,0,0,0]
    [0,2,3,1]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [1,2,3,0]
    [0,2,1,3]
    [0,0,0,0]
    [0,3,1,2]
    [0,3,2,1]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [1,3,2,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [1,2,0,3]
    [0,0,0,0]
    [1,3,0,2]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [2,3,0,1]
    [2,3,1,0]
    [1,0,2,3]
    [1,0,3,2]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [2,0,3,1]
    [0,0,0,0]
    [2,1,3,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [2,0,1,3]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [3,0,1,2]
    [3,0,2,1]
    [0,0,0,0]
    [3,1,2,0]
    [2,1,0,3]
    [0,0,0,0]
    [0,0,0,0]
    [0,0,0,0]
    [3,1,0,2]
    [0,0,0,0]
    [3,2,0,1]
    [3,2,1,0]
  ]
  return

SimplexNoise::dot = (g, x, y) ->
  g[0] * x + g[1] * y

SimplexNoise::noise = (xin, yin) ->
  # Skew the input space to determine which simplex cell we're in 
  F2 = 0.5 * (Math.sqrt(3.0) - 1.0)
  s = (xin + yin) * F2 # Hairy factor for 2D
  i = Math.floor(xin + s)
  j = Math.floor(yin + s)
  G2 = (3.0 - Math.sqrt(3.0)) / 6.0
  t = (i + j) * G2
  X0 = i - t # Unskew the cell origin back to (x,y) space
  Y0 = j - t
  x0 = xin - X0 # The x,y distances from the cell origin
  y0 = yin - Y0
  
  # For the 2D case, the simplex shape is an equilateral triangle. 
  # Determine which simplex we are in. 
  if x0 > y0 # lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1 = 1
    j1 = 0
  else # upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1 = 0
    j1 = 1
  # A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and 
  # a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where 
  # c = (3-sqrt(3))/6 
  x1 = x0 - i1 + G2 # Offsets for middle corner in (x,y) unskewed coords
  y1 = y0 - j1 + G2
  x2 = x0 - 1.0 + 2.0 * G2 # Offsets for last corner in (x,y) unskewed coords
  y2 = y0 - 1.0 + 2.0 * G2
  
  # Work out the hashed gradient indices of the three simplex corners 
  ii = i & 255
  jj = j & 255
  gi0 = @perm[ii + @perm[jj]] % 12
  gi1 = @perm[ii + i1 + @perm[jj + j1]] % 12
  gi2 = @perm[ii + 1 + @perm[jj + 1]] % 12
  
  # Calculate the contribution from the three corners 
  t0 = 0.5 - x0 * x0 - y0 * y0
  if t0 < 0
    n0 = 0.0
  else
    t0 *= t0
    n0 = t0 * t0 * @dot(@grad3[gi0], x0, y0) # (x,y) of grad3 used for 2D gradient
  t1 = 0.5 - x1 * x1 - y1 * y1
  if t1 < 0
    n1 = 0.0
  else
    t1 *= t1
    n1 = t1 * t1 * @dot(@grad3[gi1], x1, y1)
  t2 = 0.5 - x2 * x2 - y2 * y2
  if t2 < 0
    n2 = 0.0
  else
    t2 *= t2
    n2 = t2 * t2 * @dot(@grad3[gi2], x2, y2)
  
  # Add contributions from each corner to get the final noise value. 
  # The result is scaled to return values in the interval [-1,1]. 
  70.0 * (n0 + n1 + n2)


# 3D simplex noise 
SimplexNoise::noise3d = (xin, yin, zin) ->

  # Skew the input space to determine which simplex cell we're in 
  F3 = 1.0 / 3.0
  s = (xin + yin + zin) * F3 # Very nice and simple skew factor for 3D
  i = Math.floor(xin + s)
  j = Math.floor(yin + s)
  k = Math.floor(zin + s)
  G3 = 1.0 / 6.0 # Very nice and simple unskew factor, too
  t = (i + j + k) * G3
  X0 = i - t # Unskew the cell origin back to (x,y,z) space
  Y0 = j - t
  Z0 = k - t
  x0 = xin - X0 # The x,y,z distances from the cell origin
  y0 = yin - Y0
  z0 = zin - Z0
  
  # For the 3D case, the simplex shape is a slightly irregular tetrahedron. 
  # Determine which simplex we are in. 

  if x0 >= y0
    if y0 >= z0
      i1 = 1 # X Y Z order
      j1 = 0
      k1 = 0
      i2 = 1
      j2 = 1
      k2 = 0
    else if x0 >= z0 # X Z Y order
      i1 = 1
      j1 = 0
      k1 = 0
      i2 = 1
      j2 = 0
      k2 = 1
    else # Z X Y order
      i1 = 0
      j1 = 0
      k1 = 1
      i2 = 1
      j2 = 0
      k2 = 1
  else # x0<y0
    if y0 < z0 # Z Y X order
      i1 = 0
      j1 = 0
      k1 = 1
      i2 = 0
      j2 = 1
      k2 = 1
    else if x0 < z0 # Y Z X order
      i1 = 0
      j1 = 1
      k1 = 0
      i2 = 0
      j2 = 1
      k2 = 1
    else # Y X Z order
      i1 = 0
      j1 = 1
      k1 = 0
      i2 = 1
      j2 = 1
      k2 = 0
  
  # A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z), 
  # a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and 
  # a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where 
  # c = 1/6.
  x1 = x0 - i1 + G3 # Offsets for second corner in (x,y,z) coords
  y1 = y0 - j1 + G3
  z1 = z0 - k1 + G3
  x2 = x0 - i2 + 2.0 * G3 # Offsets for third corner in (x,y,z) coords
  y2 = y0 - j2 + 2.0 * G3
  z2 = z0 - k2 + 2.0 * G3
  x3 = x0 - 1.0 + 3.0 * G3 # Offsets for last corner in (x,y,z) coords
  y3 = y0 - 1.0 + 3.0 * G3
  z3 = z0 - 1.0 + 3.0 * G3
  
  # Work out the hashed gradient indices of the four simplex corners 
  ii = i & 255
  jj = j & 255
  kk = k & 255
  gi0 = @perm[ii + @perm[jj + @perm[kk]]] % 12
  gi1 = @perm[ii + i1 + @perm[jj + j1 + @perm[kk + k1]]] % 12
  gi2 = @perm[ii + i2 + @perm[jj + j2 + @perm[kk + k2]]] % 12
  gi3 = @perm[ii + 1 + @perm[jj + 1 + @perm[kk + 1]]] % 12
  
  # Calculate the contribution from the four corners 
  t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
  if t0 < 0
    n0 = 0.0
  else
    t0 *= t0
    n0 = t0 * t0 * @dot(@grad3[gi0], x0, y0, z0)
  t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
  if t1 < 0
    n1 = 0.0
  else
    t1 *= t1
    n1 = t1 * t1 * @dot(@grad3[gi1], x1, y1, z1)
  t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
  if t2 < 0
    n2 = 0.0
  else
    t2 *= t2
    n2 = t2 * t2 * @dot(@grad3[gi2], x2, y2, z2)
  t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
  if t3 < 0
    n3 = 0.0
  else
    t3 *= t3
    n3 = t3 * t3 * @dot(@grad3[gi3], x3, y3, z3)
  
  # Add contributions from each corner to get the final noise value. 
  # The result is scaled to stay just inside [-1,1] 
  32.0 * (n0 + n1 + n2 + n3)