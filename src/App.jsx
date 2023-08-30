import Sentiment from "sentiment";
import { useState, useRef } from "react";
import useAutosizeTextArea from "./hooks/useAutosizeTextArea";
const sentiment = new Sentiment();

function App() {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);

  useAutosizeTextArea(textAreaRef.current, text);

  const score = analysis?.comparative?.toFixed(2);
  let words = analysis?.calculation;
  words?.sort((a, b) => a.last_nom - b.last_nom);
  console.log(words);

  async function handleSubmit() {
    setAnalysis(false);
    if (!text && !loading) {
      alert("Fill out the text-input then...");
      return;
    }
    const data = sentiment.analyze(text);
    setLoading(true);
    setTimeout(
      () => {
        setLoading(false);
        setAnalysis(data);
      },
      text.length < 10 ? text.length * 10 : 1000
    );
    // setAnalysis(data);
  }

  return (
    <div className="App">
      <main className="prose container mx-auto flex flex-col items-center">
        <h1 className="mt-6 mb-0">Sentimentool</h1>
        <h2>A Sentiment Analyis web-app.</h2>
        <h4 className="text-center">
          Sentiment analysis, a branch of natural language processing, involves
          using computational methods to classify and quantify the emotional
          tone expressed in text data.
        </h4>
        {/* <h2>Upload text</h2> */}
        <textarea
          type="textarea"
          onChange={(e) => setText(e.target.value)}
          value={text}
          className="textarea textarea-primary m-2 textbox text-lg"
          ref={textAreaRef}
          rows={1}
          placeholder="Upload the text you want analysed here"
        ></textarea>
        <button className="btn btn-primary text-center" onClick={handleSubmit}>
          Submit
        </button>
        {loading && (
          <span class="m-5 loading loading-spinner loading-lg"></span>
        )}
        {analysis && (
          <div className="container flex flex-col items-center">
            <div className="stats shadow">
              <div className="stat">
                <div className="stat-title text-center">Score</div>
                <div className="stat-value text-center">{`${
                  score > 0 ? "+" : ""
                }${score}`}</div>
                <div className="stat-desc text-center">
                  Ranked between -5 and 5
                </div>
              </div>
            </div>
            <progress
              className={`progress progress${
                score ? (score > 0 ? "-success" : "-error") : ""
              } w-56`}
              value={+score + 5}
              max="10"
            ></progress>
            <h2>Why?</h2>
            <p className="text-center">
              Our program gave this{" "}
              {score < -1
                ? "poor score as there was a high frequency of negative words"
                : score > 1
                ? "high score as there was high frequency of positive words"
                : "mediocre score as there was a lot of varied/neutral words"}
              {"."}
            </p>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Word</th>
                    <th>Sentiment</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word, i) => {
                    const [w, s] = Object.entries(word)[0];
                    return (
                      <tr key={i}>
                        <th>{i + 1}</th>
                        <td>{w}</td>
                        <td>{s}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-center">
              The algorithm works by assigning a sentiment score to each word.
              Most words are neutral so don't get a score. Each score is between
              -5 and 5. After, we sum up the scores, we then divide by the total
              number of words to get the overall score.
            </p>
          </div>
        )}
      </main>
      <footer
        className={`footer footer-center p-4 bg-base-300 text-base-content ${
          analysis ? "" : "fixed"
        } bottom-0`}
      >
        <div>
          <p>
            Developed by Daniel Fostiak. Code @
            <a
              href="https://github.com/danielfostiak/sentimentanalysis"
              className="link link-primary "
            >
              https://github.com/danielfostiak/sentimentanalysis
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
