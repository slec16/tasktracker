
import DarkModeIcon from '@mui/icons-material/DarkMode'
import IconButton from '@mui/material/IconButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const Header = () => {


    return(
        <header className="w-full flex justify-between px-3 py-5">
            <p className='text-4xl font-light'><span className='text-sky-600 font-bold'>T</span>ask<span className='text-sky-600 font-bold'>T</span>racker</p>
            <div>
                <IconButton>
                    <DarkModeIcon />
                </IconButton>
                <IconButton>
                    <AccountCircleIcon />
                </IconButton>
            </div>
        </header>
    )
}

export default Header