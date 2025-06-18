import Footer from "./Components/Footer";
import Header from "./Components/Header";
import MainContent from "./Components/MainContent";
import PlaListNav from "./Components/PlayListNav"

function App() {
  return(
    <div className="Spotify">
    <Header/>
    <PlaListNav/>
    <MainContent/>
    <Footer/>
    </div>
  );
}

export default App;