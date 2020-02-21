import React,{useState} from 'react';

import StripeCheckout from 'react-stripe-checkout';

import jsPDF from 'jspdf'

import axios from 'axios'

const App=()=>{


const publishableKey = '';

const [name,setName]=useState('')

const [email,setEmail]=useState('')

const [phone,setPhone]=useState('')

const [statement,setStatement]=useState('')

const [stripe,openStripe]=useState(false)

const [download,setDownload]=useState(false)


const [token,setToken]=useState('')

const [err,setErr]=useState('')

const [file,setFile]=useState('')

const [filename,setFilename]=useState('')

const [uploadedFile,setUploadedFile]=useState('')


const handleClick=e=>{
  e.preventDefault()
if(name&&phone&&email)
{setStatement(name+' '+email+' '+phone)
setErr('')
}
else
setErr('Enter details properly')
setName('')
setEmail('')
setPhone('')

}

 
const handleInputChange=e=>{
setFilename(e.target.files[0].name)
setFile(e.target.files[0])

} 

const handleSubmit=async e=>{
  e.preventDefault()
const formData=new FormData()
formData.append('file',file)

try{
const res=await axios.post('/api/upload',formData,{
  headers: {
'Content-Type':'multipart/form-data'
}
})

const {fileName,filePath}=res.data

setUploadedFile(fileName + ' ' + filePath)

openStripe(true)
}catch(err){
console.log(err.message)
}
}


const generatePDF=()=>{

var doc =new jsPDF('p','pt')


doc.text(100,70,'Bill')


doc.setFont('courier')

doc.setFontType('bold')

doc.text(100,100,`token: ${token.id}`)

doc.text(100,150,`name: ${token.card.name}`)

doc.text(100,200,`email: ${token.email}`)

doc.text(100,250,`client_ip_address: ${token.client_ip}`)



doc.save("bill.pdf")


}


const onToken=token => {
//   console.log(token)
// console.log(token.client_ip)
  setToken(token)
  setDownload(true)
}


  return(
  <div className="container-fluid" 
  style={{
    width:'100vw',
    height:'100vh',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center'
}}>
 

{
  statement ==='' &&!stripe?(
<form className="form-control" style={{width:'50%',margin:'auto',alignItems:'center',justifyContent:'center',display: 'flex',flexDirection: 'column'}}>

<p style={{fontWeight:'bold'}}>
  {err}
</p>

<label htmlFor="email">
Enter your name
  </label>

  <input 
  type="text"
  name="name"
  value={name}
  style={{width:'30%'}}
  onChange={(e)=>{
    setName(e.target.value);
  }}
  autoComplete="off"
  />

<label htmlFor="email">
Enter your email
  </label>

  <input 
  type="email"
  name="email"
  value={email}
  style={{width:'30%'}}
  onChange={(e)=>{
    setEmail(e.target.value);
  }}
  autoComplete="off"
/>

<label htmlFor="email">
Enter your phone number
  </label>

  <input 
  type="tel"
  name="phone"
  value={phone}
  style={{width:'30%'}}
  onChange={(e)=>{
    setPhone(e.target.value);
  }}
  autoComplete="off"
/>



<button
className="btn btn-dark "
style={{margin:'20px'}}
onClick={handleClick}
>
  Submit
</button>
</form>

  ):
  !stripe?
  (




<div  style={{display: 'flex',flexDirection: 'column',alignItems:'center',justifyContent:'center'}}>



<form
onSubmit={handleSubmit}
style={{display: 'flex',flexDirection: 'column',alignItems:'center',justifyContent:'center'}}
>


<input
id="customFile"
type="file"
className="btn btn-dark"
onChange={
  handleInputChange
}

/>
<br/>

<input
className="btn btn-dark"
type="submit"
values="Save"
style={{margin:'auto',textAlign:'center'}}
/>


</form>

<p>
  {filename}
</p>


<p>
  {uploadedFile}
</p>

<p style={{fontWeight:'bold',margin:'20'}}>
  {statement}
</p>
<button
className="btn btn-dark"
onClick={
  (e)=>{
  e.preventDefault()
    setStatement('')
}}
>
Back
</button>
</div>

  ):(
    <div>
      <p>
      {uploadedFile}

      </p>

      <StripeCheckout
      label='Pay Now'
      billingAddress
      shippingAddress
      description={`Your total is Rs:3750/-`}
      amount={375000}
      panelLabel='Pay Now'
      token={onToken}
      currency="INR"
      stripeKey={publishableKey}
    />

<p>
  *use card number  4242 4242 4242 4242
</p>

<p >
     token id :
     <span style={{color: 'red',fontWeight:'bold'}}>
     {token.id}
     </span>

      </p>

{
  download?(
<button className="btn btn-dark"
onClick={generatePDF}

>
  Download bill
</button>
  ):null
}


    </div>
  )
}

  </div>
  )
}

export default App;
