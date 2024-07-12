import { Link, Navigate } from 'react-router-dom';
import InputBox from '../components/input.component';
import googleIcon from '../imgs/google.png';
import AnimationWrapper from '../common/page-animation';
import { useContext, useRef } from 'react'; //to refer an html element in js functions
import { Toaster, toast } from 'react-hot-toast'; //alert in react, Toaster is the html element added so that toast knows where to add the alert
import axios from "axios";
import { UserContext } from '../App';
import { storeInSession } from '../common/session';
import { authWithGoogle } from '../common/firebase';

const UserAuthForm = ({ type }) => {

    const authForm = useRef();

    let { userAuth: { access_token }, setUserAuth} = useContext(UserContext);

    const userAuthThroughServer = ( serverRoute, formData ) => {

        //axios is used to make request to server, make sure you import it
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
            storeInSession("user", JSON.stringify(data));
            console.log('Server Response:', data); // Add this line
            setUserAuth(data);
        })
        .catch(({ response }) => {
            console.error('Server Error:', error); // Add this line
            toast.error(response.data.error)
        })

    }

    const handleSubmit = (e) => {

        e.preventDefault();

        //formData
        // let form = new formData(authForm.current);
        // console.log(form);

        let serverRoute = type == "sign-in" ? "/signin" : "/signup"

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

        //formData
        let form = new FormData(authForm.current);
        let formData = {};
        
        for(let [key, value] of form.entries()) {
            formData[key] = value;
        }

        let { fullname, email, password } = formData;

        //form validations
        if(fullname) {
            if(fullname.length < 3) {
                return toast.error( "Fullname must be atleast 3 letters long" )
            }
        }
        if(!email.length) {
            return toast.error( "Enter Email" )
        }
        if(!emailRegex.test(email)) {
            return toast.error( "Email is invalid" )
        }
        if(!passwordRegex.test(password)) {
            return toast.error( "Password should be 6 to 20 letters long with a numeric, 1 lowercase and 1 uppercase letters" )
        }

        userAuthThroughServer( serverRoute, formData);


    };

    const handleGoogleAuth = (e) => {
        e.preventDefault();

        authWithGoogle().then(result => {
            if (result) {
                let serverRoute = '/google-auth';
                let formData = {
                    access_token: result.accessToken
                };
                userAuthThroughServer(serverRoute, formData);
            } else {
                toast.error('trouble login through google');
            }
        })
        .catch(err => {
            toast.error('trouble login through google');
            console.log(err);
        });

        //Assuming you have a function that handles Google Auth and returns a promise
        //try {
        //     const user = await someGoogleAuthFunction();
        //     let serverRoute = "/google-auth";

        //     let formData = {
        //         access_token: user.access_token
        //     };

        //     userAuthThroughServer(serverRoute, formData);
        // } catch (err) {
        //     toast.error('Trouble logging in through Google');
        //     console.log(err);
        // }
    };
    
    return (

    access_token ? 
    <Navigate to="/"/>
    :
        <AnimationWrapper keyValue={type}>
          <section className="h-cover flex items-center justify-center">
            <Toaster />
            <form ref={authForm} id='formElement' className="w-[80%] max-width-[400px]" >
                <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                    {type == 'sign-in' ? "Welcome back" : "Join us today" }
                </h1>

                {
                    type != "sign-in" ?
                    <InputBox
                        name = "fullname"
                        type = "text"
                        placeholder = "Full Name"
                        icon = "fi-rr-user"
                    /> 
                    : ""
                }

                <InputBox
                    name = "email"
                    type = "email"
                    placeholder = "Email"
                    icon = "fi-rr-envelope"
                />

                <InputBox
                    name = "password"
                    type = "password"
                    placeholder = "Password"
                    icon = "fi-rr-key"
                />

                <button className='btn-dark center mt-14'
                type='submit'
                onClick={handleSubmit}
                >
                    { type.replace("-", " ") }
                </button>

                <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                    <hr className='w-1/2 border-black'/>
                    <p>or</p>
                    <hr className='w-1/2 border-black'/>
                </div>

                <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
                onClick={handleGoogleAuth}
                >
                    <img src={googleIcon} alt="googleLogo" className='w-5' />
                    continue with google
                </button>

                {

                    type == "sign-in" ?
                    <p className='mt-6 text-dark-grey text-xl text-center'>
                        Don't have an account ?
                        <Link to='/signup' className='underline text-black-xl ml-1'>
                            Join us today
                        </Link>
                    </p>
                    :
                    <p className='mt-6 text-dark-grey text-xl text-center'>
                        Already a member ?
                        <Link to='/signin' className='underline text-black-xl ml-1'>
                            Sign in here.
                        </Link>
                    </p>

                }

            </form>
          </section>
        </AnimationWrapper>

    )
} 

export default UserAuthForm;
