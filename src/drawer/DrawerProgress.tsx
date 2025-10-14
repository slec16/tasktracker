import Skeleton from '@mui/material/Skeleton';


const DrawerProgress = () => {

    return (
        <>
            <Skeleton variant="text"  height={50}/>

            {/* For other variants, adjust the size with `width` and `height` */}

            <Skeleton variant="rounded" width='100%' height='25%' />
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={50} />
        </>
    )
}

export default DrawerProgress