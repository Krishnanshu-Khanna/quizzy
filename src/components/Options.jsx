import React from "react";

function Options({questions, dispatch, answer}) {
	return (
		<div className='options'>
			{questions.options.map((option, index) => {
				return (
					<button
						key={option}
						className={`btn btn-option ${index === answer ? "answer" : ""} ${
							answer !== null
								? index === questions.correctOption
									? "correct"
									: "wrong"
								: ""
						}`}
						disabled={answer !== null}
						onClick={() => dispatch({type: "newAnswer", payload: index})}>
						{option}
					</button>
				);
			})}
		</div>
	);
}

export default Options;
