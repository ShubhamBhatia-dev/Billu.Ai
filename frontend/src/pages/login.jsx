import React , {useEffect}from 'react'

import billu from '../assets/billu.png'
import github from "../assets/github.png"
import truck from "../assets/truck.gif"
import promptImage from "../assets/carbon.png"
import { useNavigate } from 'react-router-dom'
export const LoginPage = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");
    const email = params.get("email");

    if (name && email) {
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);
      navigate("/dash");
    }
  }, [navigate]);
    function login() {
        window.location.assign("http://localhost:4000/oauth");
    }
    return (
        <div className="container">
            {/* up  */}
            <div className="up">
                <div className="left">
                    <div className="billu-img">
                        <img src={billu} alt="billu" />
                    </div>
                </div>
                <div className="right">
                    <div className="sign-in">
                        <h1 className='pixel'>Start Your Journey</h1>
                        <img src={truck} alt="truc anim" id="truck" />
                        <img src={github} alt="login" id='github' onClick={login} />
                        <img src={promptImage} alt="login" id='prompt' />
                        

                    </div>

                </div>
            </div>
            {/* bottom  */}
            <div className="bottom">
                <div className="carousel">
                    <div className="carousel-track">

                        <i className="fab fa-html5"></i>
                        <i className="fab fa-css3-alt"></i>
                        <i className="fab fa-js-square"></i>
                        <i className="fab fa-react"></i>
                        <i className="fab fa-angular"></i>
                        <i className="fab fa-vuejs"></i>
                        <i className="fas fa-fire"></i>
                        <i className="fab fa-bootstrap"></i>
                        <i className="fas fa-wind"></i>


                        <i className="fab fa-node-js"></i>
                        <i className="fab fa-php"></i>
                        <i className="fab fa-python"></i>
                        <i className="fas fa-gem"></i>
                        <i className="fab fa-java"></i>
                        <i className="fab fa-microsoft"></i>


                        <i className="fas fa-database"></i>
                        <i className="fas fa-database"></i>
                        <i className="fas fa-database"></i>
                        <i className="fas fa-cloud"></i>


                        <i className="fab fa-docker"></i>
                        <i className="fab fa-github"></i>
                        <i className="fab fa-git-alt"></i>
                        <i className="fas fa-server"></i>
                        <i className="fab fa-aws"></i>
                        <i className="fab fa-microsoft"></i>
                        <i className="fas fa-bolt"></i>
                        <i className="fas fa-globe"></i>


                        <i className="fas fa-layer-group"></i>
                        <i className="fas fa-code"></i>
                        <i className="fab fa-laravel"></i>
                        <i className="fab fa-js"></i>


                        <i className="fab fa-html5"></i>
                        <i className="fab fa-css3-alt"></i>
                        <i className="fab fa-js-square"></i>
                        <i className="fab fa-react"></i>
                        <i className="fab fa-angular"></i>
                        <i className="fab fa-vuejs"></i>
                    </div>
                </div>
            </div>

        </div>
    )
}
