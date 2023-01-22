import React from 'react';
import Reset from './Reset';


function Styles({ children }) {
	return (
		<>
			<Reset />

			{children}
		</>


	);
}

export default Styles;