import React, {useState , useEffect, useRef} from  'react';
import FlashCardsList from './FlashCardList';
import axios from 'axios';
import './App.css';


function App() {

  const [flashcards , setFlashcards] = useState([]);
  const [categories , setCategories] = useState([]);
  const categoryEl = useRef();
    const amountEl = useRef();

  useEffect(()=> {
     axios.get('https://opentdb.com/api_category.php')
     .then(res => {
      setCategories(res.data.trivia_categories);
     })
  },[]);

/*   useEffect(()=> {

  },[]); */

  function decodeString(str){
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value
  }

  function handleSubmit(e){
   e.preventDefault();
       axios
         .get("https://opentdb.com/api.php",{
            params : {
              amount : amountEl.current.value,
              category : categoryEl.current.value
            }
         })
         .then((res) => {
           setFlashcards(
             res.data.results.map((questionItem, index) => {
               const answer = decodeString(questionItem.correct_answer);
               const options = [
                 ...questionItem.incorrect_answers.map((a) => decodeString(a)),
                 answer,
               ];
               return {
                 id: `${index} - ${Date.now()}`,
                 question: decodeString(questionItem.question),
                 answer: answer,
                 options: options.sort(() => Math.random() - 0.5),
               };
             })
           );
         });
  }
  return (
    <>
      <div className="form-group title">
        <h2>Take your QUIZ and fun.</h2>
      </div>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map((category) => {
              return (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">Number Of Question</label>
          <input
            type="number"
            id="amount"
            min="1"
            step="1"
            defaultValue={10}
            ref={amountEl}
          />
        </div>

        <div className="form-group boton">
          <label >Generate</label>
          <button className="btn">Do it</button>
        </div>
      </form>

      <div className="container">
        <FlashCardsList flashcards={flashcards} />
      </div>
    </>
  );
}

export default App;
