import {useEffect, useReducer} from "react";
import Header from "./Header";
import Main from "./Mainer";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import "../index.css";
const SECS_PER_QUESTION = 30;

const initialState = {
	questions: [],

	// 'loading', 'error', 'ready', 'active', 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: null,
};

function reducer(state, action) {
	switch (action.type) {
		case "dataReceived":
			return {
				...state,
				questions: action.payload,
				status: "ready",
			};
		case "dataFailed":
			return {
				...state,
				status: "error",
			};
		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "newAnswer":
			const questions = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === questions.correctOption
						? state.points + questions.points
						: state.points,
			};
		case "nextQuestion":
			return {...state, index: state.index + 1, answer: null};
		case "finish":
			return {
				...state,
				status: "finished",
				highscore: state.points > state.highscore ? state.points : state.highscore,
			};
		case "restart":
			return {
				...initialState,
				highscore: state.highscore,
				questions: state.questions,
				status: "ready",
			};

		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
			};

		default:
			throw new Error("Action unkonwn");
	}
}

export default function App() {
	const [
		{questions, status, index, answer, points, highscore, secondsRemaining},
		dispatch,
	] = useReducer(reducer, initialState);

	const numQues = questions.length;
	const maxScore = questions.reduce((prev, cur) => prev + cur.points, 0);

	useEffect(function () {
		fetch("http://localhost:8000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({type: "dataReceived", payload: data}))
			.catch((err) => dispatch({type: "dataFailed"}));
	}, []);

	return (
		<div className='app'>
			<Header />

			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQues={numQues} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQues={numQues}
							points={points}
							maxScore={maxScore}
							answer={answer}
						/>
						<Question
							questions={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
							<NextButton
								dispatch={dispatch}
								answer={answer}
								numQues={numQues}
								index={index}
							/>
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						maxScore={maxScore}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}
