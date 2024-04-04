from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from flask import Flask
from config import load_config, csrf, cors
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import LocalConfig, ProdConfig, CORS_ALLOWED_ORIGINS, csrf, SECRET_KEY, AWS_ACCESS_KEY, AWS_SECRET_KEY, S3_BUCKET

from werkzeug.middleware.proxy_fix import ProxyFix

from dotenv import load_dotenv

load_dotenv()

import numpy as np
import scipy.io as sio

import os

#from heroku_lidcavity import app, db

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# create and initialize Flask app
app = Flask(__name__)

# load configurations from the chosen environment (LocalConfig or ProdConfig)
app.config.from_object(load_config())

app.secret_key = SECRET_KEY

if (os.environ.get('FLASK_ENV') == 'production'):
    # add ProxyFix middleware to handle HTTPS headers properly
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1) # PRODUCTION 240311

    # PRODUCTION 240311
    app.config['SESSION_COOKIE_SECURE'] = True # Ensure cookies are sent only over HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['FORCE_SSL'] = True
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'

# initialize CSRF
csrf.init_app(app)

# initialize CORS with allowed origins
cors.init_app(app, resources={r"/*": {"origins": CORS_ALLOWED_ORIGINS}})

# other CORS configurations
cors.init_app(app, resources={r"/*": {"methods": ["GET", "POST", "PUT", "DELETE"]}})
cors.init_app(app, resources={r"/*": {"allowed_headers": "Content-Type"}})

# database initialization
engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'], pool_pre_ping=False, echo=False)
Session = sessionmaker(bind=engine)
session = Session()

# create the database
db = SQLAlchemy(app)
db.init_app(app)

from models import Convergence, Velocity, Pressure, Displacement, StreamlineImg, StreamlineImgP, PdfDocument, Gaia1982

# Create tables
db.create_all()

def trunc(values, decs=0):
    return np.trunc(values*10**decs)/(10**decs)

gaia1982 = Gaia1982.query.filter_by(src='gaia1982').first()

if gaia1982 is None:

    yus = {
        "Re400": {
            "y": [
                0.0,
                0.0523234200743494,
                0.0597525557620817,
                0.0659367255266418,
                0.0981199659231722,
                0.169902029120198,
                0.278874302973978,
                0.451254646840149,
                0.497151874225527,
                0.616234897769517,
                0.732837670384139,
                0.849430762081784,
                0.953756195786865,
                0.958765102230483,
                0.968740319083024,
                0.976237221189591,
                1.0,
            ],
            "u": [
                0.00250000000000006,
                -0.0828125000000000,
                -0.0893749999999999,
                -0.102500000000000,
                -0.141875000000000,
                -0.242500000000000,
                -0.325625000000000,
                -0.170312500000000,
                -0.115625000000000,
                0.0243750000000000,
                0.162187500000000,
                0.289062500000000,
                0.555937500000000,
                0.615000000000000,
                0.685000000000000,
                0.755000000000000,
                0.98,
            ]
        },
        "Re1000": {
            "y": [
                0.0,
                0.0518987341772152,
                0.0607594936708860,
                0.0683544303797468,
                0.0987341772151898,
                0.169620253164557,
                0.278481012658228,
                0.449367088607595,
                0.497468354430380,
                0.613924050632911,
                0.730379746835443,
                0.846835443037975,
                0.950632911392405,
                0.956962025316456,
                0.964556962025316,
                0.973417721518987,
                0.996202531645569,
            ],
            "u": [
                0.00608690360272607,
                -0.177768175916910,
                -0.197940603700098,
                -0.218115871470302,
                -0.294329763063941,
                -0.377183544303798,
                -0.275977766958780,
                -0.102837958455047,
                -0.0578582440765987,
                0.0613132911392401,
                0.193946364816618,
                0.337797387211944,
                0.468158471275560,
                0.515288055826030,
                0.580369198312236,
                0.663401898734177,
                0.98,
            ]
        },
        "Re3200": {
            "y": [
                0,
                0.0517135985610974,
                0.0593292197894717,
                0.0669387888685252,
                0.0985955645812794,
                0.169365363969721,
                0.279328882358123,
                0.452484909185622,
                0.500516783576711,
                0.616790676323352,
                0.734319381362457,
                0.851827912570494,
                0.954187914029163,
                0.960508375302937,
                0.968087683635387,
                0.976895578279912,
                1.0,
            ],
            "u": [
                0.00425242114884628,
                -0.318486464792360,
                -0.349554479996110,
                -0.373445487505659,
                -0.413980399976451,
                -0.337123704174477,
                -0.238568836022424,
                -0.0775436389279240,
                -0.0366690360103297,
                0.0786591429874638,
                0.205954393387447,
                0.357173002768103,
                0.472441870735503,
                0.477253502090907,
                0.489247533052367,
                0.544309002090891,
                0.98,
            ]
        },
        "Re5000": {
            "y": [
                0,
                0.0518806744487679,
                0.0583657587548638,
                0.0674448767833982,
                0.0998702983138780,
                0.169909208819715,
                0.278858625162127,
                0.450064850843061,
                0.498054474708171,
                0.617380025940337,
                0.731517509727626,
                0.850843060959793,
                0.953307392996109,
                0.961089494163424,
                0.970168612191958,
                0.976653696498054,
                1.0,
            ],
            "u": [
                0.00327332242225875,
                -0.409165302782324,
                -0.421440261865794,
                -0.431260229132570,
                -0.401800327332242,
                -0.323240589198036,
                -0.225040916530278,
                -0.0703764320785598,
                -0.0261865793780687,
                0.0867430441898527,
                0.207037643207856,
                0.339607201309329,
                0.464811783960720,
                0.464811783960720,
                0.467266775777414,
                0.484451718494272,
                0.98,
            ]
        }
    }

    xvs = {
        "Re400": {
                "x": [
                    -0.00159929218020121,
                    0.0610893962414221,
                    0.0648484438834698,
                    0.0748908647711691,
                    0.0899525360481926,
                    0.151474124312504,
                    0.223067534282399,
                    0.233118775415464,
                    0.497107674159219,
                    0.801429921006657,
                    0.856748498260866,
                    0.942024793461711,
                    0.952051533913206,
                    0.958306486368236,
                    0.965822621597806,
                    0.998399727792536,
                ],
                "v": [
                    0.00163845992931322,
                    0.184369059968897,
                    0.198646514205184,
                    0.210058429367027,
                    0.230032869552818,
                    0.282791445260942,
                    0.304113424485498,
                    0.302670786153718,
                    0.0552008938123589,
                    -0.385144719374411,
                    -0.446639869755964,
                    -0.226806190830125,
                    -0.192541736124063,
                    -0.153987047274611,
                    -0.122575571359010,
                    0.00306674365082682,
                ]
            },
        "Re1000": {
            "x": [
                0.0,
                0.0634307615214768,
                0.0684378865939019,
                0.0771837172520708,
                0.0921737734696751,
                0.154574922876963,
                0.225598584381215,
                0.234315053477192,
                0.500777102679340,
                0.803344086189887,
                0.860567813464038,
                0.906593040918273,
                0.946646126622716,
                0.954197920418422,
                0.960504783977200,
                0.968064407522824,
                1.00075165599211,
            ],
            "v": [
                0.00439014077890365,
                0.276176419925148,
                0.291890728010148,
                0.306046915861507,
                0.328072002380244,
                0.373793827025165,
                0.334770353434911,
                0.325378568408525,
                0.0279420285316088,
                -0.313337196009959,
                -0.419907922140967,
                -0.507675503844407,
                -0.385100768881442,
                -0.328562144725097,
                -0.270457570585195,
                -0.207639486994785,
                0.00753378537089533,
            ]
        },
        "Re3200": {
            "x": [
                0.0,
                0.0587909416933421,
                0.0648169719427298,
                0.0768635292175333,
                0.0913113265521386,
                0.153838957322498,
                0.224766342282187,
                0.231981068909536,
                0.496484357085860,
                0.803070798976401,
                0.855967787795684,
                0.904040283599476,
                0.952105441771305,
                0.958166325772515,
                0.966661469177360,
                0.998282994120723,
            ],
            "v": [
                0.00243279187724133,
                0.397378997862915,
                0.408062590000642,
                0.423027323507021,
                0.431594742586699,
                0.376240380823099,
                0.293160042925147,
                0.286773001183193,
                0.00989846551771567,
                -0.307435039027030,
                -0.367078246672843,
                -0.439536628541554,
                -0.520531611435700,
                -0.469299164427160,
                -0.386049327230870,
                0.00243279187724133,
            ]
        },
        "Re5000": {
            "x": [
                0.0,
                0.0606036814586758,
                0.0679034154530041,
                0.0776276705716973,
                0.0909821647216288,
                0.154100095148902,
                0.224510282250150,
                0.233010126161088,
                0.498877467282050,
                0.803591356965404,
                0.858215051472004,
                0.906774639172560,
                0.944342565954639,
                0.951608652007380,
                0.958900908681356,
                0.967453093834762,
                0.999478456905399,
            ],
            "v": [
                -0.000921953599488545,
                0.427564393748212,
                0.438317902013455,
                0.442604649771661,
                0.429652809322723,
                0.354132247626418,
                0.280749825684969,
                0.274269979867315,
                0.00662041944028513,
                -0.302035887399033,
                -0.364615076894893,
                -0.414258128314556,
                -0.528492890003010,
                -0.556508540034508,
                -0.554370400279652,
                -0.500542666524598,
                -0.000919336537364868,
            ]
        },
    }

    Re = ['400','1000','3200','5000']
    N = 120; xy = np.linspace(0,1,N+1)
    for i in range(0,len(Re)):
        #print(f"{bcolors.WARNING} {len(yus[]['y'])} {bcolors.ENDC}")
        idx = f"Re{Re[i]}"

        matu_contents = sio.loadmat('Re' + Re[i] + 'u_120x_120y.mat')
        matv_contents = sio.loadmat('Re' + Re[i] + 'v_120x_120y.mat')

        #matu_contents = sio.loadmat('/Users/stephenhodson/matlab/lidcavity/Re' + Re[i] + 'u_120x_120y.mat')
        #matv_contents = sio.loadmat('/Users/stephenhodson/matlab/lidcavity/Re' + Re[i] + 'v_120x_120y.mat')

        axisID = 'yu'
        #print([*'yu'][0])
        for j in range(0,len(yus[idx]['y'])):
                p = Gaia1982(
                        int(Re[i]),
                        axisID,
                        axisX = yus[idx]['y'][j],
                        axisVel = yus[idx]['u'][j],
                        src = f'{Gaia1982.__table__}'
                    )
                session.add(p)
                session.commit()
                #print(f"{bcolors.OKGREEN}Successfully written a row to!{bcolors.ENDC}")

        for j in range(0, N):
            if (j < N - 1):
                p = Gaia1982(
                    int(Re[i]),
                    axisID,
                    axisX = np.round(trunc(xy[j], decs=3), 3),
                    axisVel = matu_contents['arrU'][2*j+1, N]/10,
                    src = 'cfd'
                )
                session.add(p)
                session.commit()
            else:
                p = Gaia1982(
                    int(Re[i]),
                    axisID,
                    axisX = np.round(trunc(xy[N], decs=3), 3),
                    axisVel = 1,
                    src = 'cfd'
                )
                session.add(p)
                session.commit()

        axisID = 'xv'
        for j in range(0,len(xvs[idx]['x'])):
                p = Gaia1982(
                        int(Re[i]),
                        axisID,
                        axisX = xvs[idx]['x'][j],
                        axisVel = xvs[idx]['v'][j],
                        src = f'{Gaia1982.__table__}'
                    )
                session.add(p)
                session.commit()

        for j in range(0, N):
            p = Gaia1982(
                int(Re[i]),
                axisID,
                axisX = np.round(trunc(xy[j], decs=3), 3),
                axisVel = matv_contents['arrV'][N,2*j+1]/10,
                src = 'cfd'
            )
            session.add(p)
            session.commit()

migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

print(f"{bcolors.WARNING} ** HI FROM MANAGE.PY ** {bcolors.ENDC}")

if __name__ == '__main__':
    manager.run()