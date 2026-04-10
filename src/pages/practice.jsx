import {useState,useNavigate} from 'react'



function LoginPage () {
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    const navigate=useNavigate();

    const handleLogin = aysnc (e) => {
        e.preventDefault();
        try
        { 
               const {data} = await axios.post('api/auth/login' , {email,password});
               localStorage.setItem('token',data.token); 
               navigate('/contests');// name of the token field from json 


            

        }
        catch(err)
        {
            setError('Invalid name or password')
        }
    }

    return (
        <div>






        </div>



    )

    


}
//this was login page  practice .!!