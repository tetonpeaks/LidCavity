## Getting Started with The Lid-Driven Cavity Flow

# The Problem

## The Stack
Starting closest to the machine, the techstack starts with its computational engine, the CFD solver and integrator of the velocity field. In order to generate the positions of the particles over time, the velocity field generated by the solver needs to be integrated over a specified time interval, so I wrote another set of code in F90 to handle the ordinary differential equation (ODE). The code to integrate the velocity field to find position or displacement uses a fourth-order Runge-Kutta numerical method, RK4. In order to deal with the Taylor series of the RK4 method, I borrowed a 2D piecewise linear interpolator distributed under the GNU LGPL license from John Burkardt.

Python C/API extension modules of the solver and ODE integrator needed to be built in order to interface the solver and ODE integrator with the Flask web framework on the backend written in Python. In addition, the backend communicates with a MySQL database in order to manage data generated when users run simulations. Functions needed to be written in order to handle saving and retrieving user requests for the velocity field, particle displacements, and storage of the image source files generated by Matplotlib in a socket.io route. Socket.IO was chosen for suitability in long-polling environments as well as its room management, event-based communication, and reconnection handling features. The backend serves the frontend written in JavaScript, which controls the HTML5 template and CSS3 styles, creating the interactive and hopefully visually appealing user interface of the web application. The application uses the Mailgun to handle registration and password reset requests. The PDF file is brought to by an Amazon S3 bucket.

## Usage
The software application cannot effectively be run without a Fortran compiler. Therefore, in order to view the application, please visit https://desolate-bastion-69064.herokuapp.com/.

I also prefer not to share the CFD solver publicly.

## Learn More

Hello World



