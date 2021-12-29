import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dog from './dog.jpg'
function App() {
  const [value, setValue] = useState("No Value");
  const [selectedFile, setSelectedFile] = useState();
  const[image, setImage] = useState();
  const[loading,setLoading]=useState();
  const [breed,setBreed] = useState();
  const website = "https://calm-sands-44768.herokuapp.com";


  useEffect(() => {
    fetch(` ${website}/`, {
      method: 'GET',
    }).then((response) => {
      response.text().then((text) => {
        setValue(text);
      })
    })
  }, []);
    
    // On file select (from the pop up)
    const onFileChange = (event) => {
      // Update the state
      setSelectedFile(event.target.files[0] )  
      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();
        reader.onload = (e) => {
          setImage(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }  
    };
    
    // On file upload (click the upload button)
    const onFileUpload = () => {
    
      // Create an object of formData
      const formData = new FormData();
    
      // Update the formData object
      formData.append(
        "image",
        selectedFile,
      );
    
      setLoading(true);
      setBreed(null);    
      // Request made to the backend api
      // Send formData object
      axios.post(`${website}/predict`, formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
        }).then( (response) => {
          if(response.status===200){
            setBreed(response.data)
          }
          setLoading(false)
          console.log(response);
        });
      };
    const fileData = () => {
    
      if (selectedFile) {
        return (
          <div>
            <h4>Selected Image:</h4>
            <img src={image} />
          </div>
        );
      } 
    };

    const showLoading = () =>{
      if(loading){
      return "Loading ..."
      }
    }
    //Doesn't work currently on sending img to server
    // const clickImage1=()=>{
    //   const res = fetch(dog).then((response)=>{
    //    return response;
    //   })
    //   setSelectedFile(res)
    //   setImage(dog)
    //   console.log("clicked")
    //   onFileUpload()
    // }
  return (
    <div className="App">
      <header className="App-header">
        <h3 style={{color:'#fafafa'}}>Dog Breed Detection</h3>
        {/* <img src={dog} onClick={clickImage1} /> */}
    <div>
      {!selectedFile && <p>Upload an image or select an image</p>}
      
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                  Detect Breed!
                </button>
            </div>
          {fileData()}
          {showLoading()}
          {breed && <p id="response">This dog is a {breed}.</p>}
      </header>
    </div>
  );
}

export default App;
