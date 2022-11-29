let useContext=React.useContext
import { ThemeContext } from '../context/ThemeContext.jsx'

const SelectButton = ({ children, selected, onClick }) => {
  const { theme, setTheme } = useContext(ThemeContext)

  return (
    <>
      {theme == "dark" ? (
        <span onClick={onClick} style={{
          border: "1px solid #FFD700",
          borderRadius: 5,
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          cursor: "pointer",
          textAlign: "center",
          backgroundColor: selected ? "#FFD700" : "",
          color: selected ? "black" : "",
          fontWeight: selected ? 700 : 500,
          width: "22%",
        }}>
          <p className='text-lg'>{children}</p>
        </span>
      ) : (
        <span onClick={onClick} style={{
          border: "1px solid #14B8A6",
          borderRadius: 5,
          padding: 10,
          paddingLeft: 20,
          paddingRight: 20,
          cursor: "pointer",
          textAlign: "center",
          backgroundColor: selected ? "#14B8A6" : "",
          color: selected ? "black" : "",
          fontWeight: selected ? 700 : 500,
          width: "22%",
        }}>
          <p className='text-lg'>{children}</p>
        </span>
      )}
    </>
  );
};

export default SelectButton;