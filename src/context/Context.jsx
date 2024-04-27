import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompts, setRecentPrompts] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const paraDelay=(index,nextWord)=>{
    setTimeout(function(){
      setResultData(prev=>prev+nextWord)
    },75*index)
  }

  const newChat = ()=>{
    setLoading(false);
    setShowResult(false);
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
    let response;
    if(prompt !==undefined){
      response= await runChat(prompt);
      setRecentPrompts(prompt);
    }
    else{
      setPrevPrompts((prev=>[...prev,input]))
      setRecentPrompts(input);
      response= await runChat(input);
    }
    let responseArray= response.split("**");
    let newResponse="";
    for(let i=0; i<responseArray.length;i++){
      if(i===0 || i%2 !==1){
        newResponse+= responseArray[i];
        
      }
      else{
        newResponse += "<b>"+ responseArray[i] +"</b>"
      }
    }
    let newResponse2=newResponse.split("*").join("<br>");
    let newResponseArray=newResponse2.split(" ");
    for(let i=0; i<newResponseArray.length; i++){
      const nextWord = newResponseArray[i];
      paraDelay(i,nextWord+ " ")
    }

    // setResultData(newResponse2);
    setLoading(false);
    setInput("");
  };

  const contextValue = {
    input,
    setInput,
    recentPrompts,
    setRecentPrompts,
    prevPrompts,
    setPrevPrompts,
    showResult,
    setShowResult,
    loading,
    setLoading,
    resultData,
    setResultData,
    onSent,
    newChat
    
  };
  return (
    <context.Provider value={contextValue}>{props.children}</context.Provider>
  );
};

export default ContextProvider;
