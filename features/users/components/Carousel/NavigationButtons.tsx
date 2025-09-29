// set type
interface NavigationButtonsProps {
    onNext: () => void;
    onPrev: () => void;
  }
const NavigationButtons : React.FC  <NavigationButtonsProps> = ({ onNext , onPrev }) => {
  return (
    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
      <button onClick={onPrev} className="btn btn-circle">❮</button>
      <button onClick={onNext} className="btn btn-circle">❯</button>
    </div>
  )
}

export default NavigationButtons