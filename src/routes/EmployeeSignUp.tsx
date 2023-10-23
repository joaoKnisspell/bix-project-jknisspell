import FormPageLayout from '../components/FormPageLayout'
import Input from '../components/FormPageLayout/input'
import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

//Firebase imports
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../libs/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useUserContext } from '../context/UserContext'
import Loading from '../components/Loading'


export default function EmployeeSignUp() {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [loadingAuth, setLoadingAuth] = useState(false)
  const navigate = useNavigate()

  const { setUserData } = useUserContext()

  async function signUpEmployeeUser(email: string, password: string) {
    setLoadingAuth(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (value) => {
          const docRef = doc(db, "users", value.user.uid)
          const userData = {
            name: name,
            email: email,
            role: role,
            isAdmin: true,
            userUid: value.user.uid
          }
          await setDoc(docRef, userData)
            .then(() => {
              localStorage.setItem("@userData", JSON.stringify(userData))
              setUserData(userData)
              alert("Colaborador registrado com sucesso!")
              navigate("/", { replace: true })
              setLoadingAuth(false)
            })
        })
    } catch (err) {
      console.log(err)
      setLoadingAuth(false)
    }
  }

  function handleOnSubmit(e: FormEvent) {
    e.preventDefault()
    if (name !== '' && email !== '' && password !== '') {
      signUpEmployeeUser(email, password)
    }
  }

  return (
    <FormPageLayout subheading="Olá Colaborador, crie sua conta agora mesmo!">
      <form className="flex flex-col gap-6" onSubmit={handleOnSubmit}>
        <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type='password' placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input placeholder="Cargo" value={role} onChange={(e) => setRole(e.target.value)} />

        <div className="flex flex-col gap-2 text-center">
          <button type="submit" className="w-full bg-zinc-950 py-3 text-zinc-50 font-medium md:text-base text-sm flex items-center justify-center">
            {loadingAuth ?
              <Loading /> :
              'Registrar'
            }
          </button>
          <Link to='/guestSignUp' className="text-sm underline">Não trabalha na Bix? Faça seu cadastro de visitante!</Link>
          <Link className="text-sm underline" to='/SignIn'>Já possui conta? Faça seu login agora mesmo!</Link>
        </div>
      </form>
    </FormPageLayout>
  )
}
