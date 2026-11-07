import User from "../../models/user/user.model.js"
import { sendEmail } from "../../services/mail.service.js";
import jwt  from "jsonwebtoken"

const userCtrl = {
    signup: async (req, res) => {
        const { username, email, password } = req.body;
        console.log(username, email)


        const isAlreadyExist = await User.findOne({
            $or: [{ email: email.toLowerCase().trim() },
            { username }]
        })

        if (isAlreadyExist) {
            return res.status(400).json({
                msg: "username or email already exists",
                err: "user already exists"
            })
        }


        const newUser = await User.create({
            username,
            email: email.toLowerCase().trim(),
            password
        })
        const tokenVerify = jwt.sign({id:newUser._id},process.env.JWTTOKEN)

        sendEmail({
            to: email,
            subject: "Welcome to PrepAI 🚀",
            html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:10px;">
      <h2 style="color:#2563eb;margin-bottom:10px;">Welcome to PrepAI 👋</h2>

      <p style="color:#444;line-height:1.6;">
        Hi <strong>${username}</strong>,
      </p>

      <p style="color:#444;line-height:1.6;">
        Thanks for joining <strong>PrepAI</strong>! Your AI-powered research and learning assistant is ready.
      </p>

      <a href=${process.env.CLIENTURI}/verify?token=${tokenVerify}
         style="display:inline-block;margin-top:16px;padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
         Verify Hear
      </a>

      <p style="margin-top:24px;color:#777;font-size:13px;">
        Happy learning,<br>
        <strong>Team PrepAI</strong>
      </p>
    </div>
  `
        });



        console.log("user created sucessfully")
        res.status(201).json({

            msg: "user created",
            user:{
                id:newUser._id,
                username:newUser.username,
                email:newUser.email
            }
        })



    },
    verifyUser:async(req,res)=>{
        const {token} = req.query;
        try {
             const isValidToken = jwt.verify(token,process.env.JWTTOKEN)

              if(!isValidToken){
           return res.status(404).json({
                msg:"token is not valis"
            })
        }
        const isUserIdValid = await User.findOne({_id:isValidToken.id})
        if(!isUserIdValid){
             return res.status(404).json({
                msg:"token is not valis"
            })
        }
        const updateStatus = await User.findByIdAndUpdate({_id:isValidToken.id},{verified:true})

       return res.status(201).send(`
            <hi>user verified<h1/>
            <a href="${process.env.CLIENTURI}" >try Login now<a/>
            `)
            
        } catch (error) {
            console.log(error)
            res.send(`<h1>smthing went wrng</h1>`)
            
        }
       
       },
    login:async(req,res)=>{
        const {email,password} = req.body

        const getUser = await User.findOne({email}).select("+password");

        if(!getUser){
            return res.status(400).json({
                msg:"user or passcode may be wrong"
            })
        }
        const verifyUserPasscode = await getUser.comparePassword(password)

        if(!verifyUserPasscode){
            return res.status(400).json({
                msg:"email or passcode maybe wrong"
            })
        }
        if(!getUser.verified){
            const tokenVerify = jwt.sign({id:getUser._id},process.env.JWTTOKEN)

            sendEmail({
            to: email,
            subject: "Welcome back to PrepAI 🚀",
            html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:10px;">
      <h2 style="color:#2563eb;margin-bottom:10px;">Welcome to PrepAI 👋</h2>

      <p style="color:#444;line-height:1.6;">
        Hi <strong>${getUser.username}</strong>,
      </p>

      <p style="color:#444;line-height:1.6;">
        Thanks for joining <strong>PrepAI</strong>! Your AI-powered research and learning assistant is ready.
      </p>

      <a href=${process.env.CLIENTURI}/verify?token=${tokenVerify}
         style="display:inline-block;margin-top:16px;padding:10px 18px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">
         Verify Hear
      </a>

      <p style="margin-top:24px;color:#777;font-size:13px;">
        Happy learning,<br>
        <strong>Team PrepAI</strong>
      </p>
    </div>
  `
        })
             return res.status(400).json({
                msg:"User is not verified pleas verify we have sent an email"
            })
        }
        const token = jwt.sign({
            id:getUser._id,
            username:getUser.username,
        },process.env.JWTTOKEN,{expiresIn:'7d'})

        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
});
        res.status(200).json({
            msg:"login success",
            user:{
                id:getUser._id,
                username:getUser.username,
                email:getUser.email
            }

        })

    },
    logout: async (req, res) => {
    // options must match the ones used in res.cookie() at login (currently none)
    res.clearCookie("token")
    return res.status(200).json({
        msg: "logout success",
        success: true
    })
},
    getme:async(req,res)=>{
        const userId = req.user.id;
        console.log(userId)
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                msg:"user not found",
                success:false,
                err:"User not found"
            })
        }
        res.status(200).json({
            msg:"user founded success",
            success:true,
            user
        })

    }
}

export default userCtrl;