import ThemeBtn from './components/ThemeBtn';
import Card from './components/Card';
import { ThemeProider } from './Contexts/theme'
import { useEffect, useState } from 'react'
function App() {
	const [themeMode, setThemeMode] = useState("light");
	const darkTheme = () => {
		setThemeMode("dark");
	}
	const lightTheme = () => {
		setThemeMode("light");
	}

	// actual change in theme
	useEffect(() => {
		document.querySelector("html").classList.remove("light", "dark");
		document.querySelector("html").classList.add(themeMode);
	}, [themeMode])
	return (
		<ThemeProider value={{ themeMode, darkTheme, lightTheme }}>
			<div className="flex flex-wrap min-h-screen items-center">
				<div className="w-full">
					<div className="w-full max-w-sm mx-auto flex justify-end mb-4">
						{/* Theme Switcher btn */}
						<ThemeBtn />
					</div>

					<div className="w-full max-w-sm mx-auto">
						{/* card */}
						<Card />
					</div>
				</div>
			</div>
		</ThemeProider>
	)
}

export default App
