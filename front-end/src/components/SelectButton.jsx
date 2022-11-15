
const SelectButton = ({ children, selected, onClick }) => {
  return (
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
      {children}
    </span>
  );
};

export default SelectButton;