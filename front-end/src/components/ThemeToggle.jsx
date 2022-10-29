let useContext=React.useContext;
import reactIcons from '/third-party/esm/react-icons';let HiSun=await reactIcons("HiSun"),HiMoon=await reactIcons("HiSun");
import { ThemeContext } from '../context/ThemeContext.jsx';

const ThemeToggle = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div className='p-2 sm:hover:scale-110'>
      {theme === 'dark' ? (
        <div className='flex items-center cursor-pointer' onClick={()=> setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <HiSun className='text-primary text-3xl' />
        </div>
      ) : (
        <div className='flex items-center cursor-pointer' onClick={()=> setTheme(theme === 'dark' ? 'light' : 'dark')}>
          <HiMoon className='text-primary text-3xl' />
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;