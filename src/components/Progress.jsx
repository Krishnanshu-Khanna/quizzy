import React from 'react'

function Progress({numQues, index, points, maxScore,answer}) {
	return (
		<header className='progress'>
            <progress max={numQues} value={index + Number(answer!==null)}/>
			<p>
				Question <strong>{index + 1}</strong> / {numQues}
			</p>
			<p>
				<strong>{points}</strong>/{maxScore}
			</p>
		</header>
	);
}

export default Progress
