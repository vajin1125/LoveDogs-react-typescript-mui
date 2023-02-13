import React, {useState, useEffect} from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Paper, Button } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Carousel from 'react-material-ui-carousel';
import Typography from '@mui/material/Typography';
import ApiKey from './ApiKey';

const style = {
  position: 'absolute' as 'absolute',
  top: '45%',
  left: '50%',
  margin: 0,
  padding: 0,
  transform: 'translate(-50%, -50%)',
  width: '60%',
  height: '80%',
  // bgcolor: 'background.paper',
  // border: '2px solid #000',
  // boxShadow: 24,
  // p: 4,
  backgroundColor: 'transparent' ,
  outline: 'none'
};

const ShowBreedText = (props:any) => {
  return(
        <Box sx={{ width: '100%', color: 'white', margin: 0, padding: 0 }}>
          <Typography variant='h6' >
            NAME: {props.dog[0]['breeds'][0]['name']}
          </Typography>
          <Typography variant='subtitle1' >
            BREED FOR: {props.dog[0]['breeds'][0]['bred_for'] ?? 'Unknown'}
          </Typography>
          <Typography variant='subtitle1' >
            BREED GROUP: {props.dog[0]['breeds'][0]['breed_group'] ?? 'Unknown'}
          </Typography>
          <Typography variant='body1' >
            WEIGHT: {props.dog[0]['breeds'][0]['weight']['imperial']} {`lb`} {`, `} {props.dog[0]['breeds'][0]['weight']['metric']} {`kg`}
          </Typography>
          <Typography variant='body1' >
            HEIGHT: {props.dog[0]['breeds'][0]['height']['imperial']} {`in`} {`, `} {props.dog[0]['breeds'][0]['height']['metric']} {`cm`}
          </Typography>
          <Typography variant='subtitle1' >
            LIFE SPAN: {props.dog[0]['breeds'][0]['life_span']}
          </Typography>
          <Typography variant='subtitle1' >
            TEMPERAMENT: {props.dog[0]['breeds'][0]['temperament']}
          </Typography>
          <Typography variant='subtitle1' >
            ORIGIN: {props.dog[0]['breeds'][0]['origin'] ?? 'Unknown'} COUNTRY CODE: {props.dog[0]['breeds'][0]['country_code'] ?? 'Unknown'}
          </Typography>
        </Box>
      )
}

const DogModal = (props: any) => {
  const [dog, setDog] = useState([])
  const [openLoading, setOpenLoading] = useState(false)
  const breed_id: string = props.breed_id

  const closeModal = () => {
    props.handleClose()
  }

  useEffect(() => {
    setOpenLoading(true)
    setDog([])
    const fetchSingleDogData = async () => {
      try {
        const res = await fetch(
          `${ApiKey.endpoint}v1/images/search?size=full&breed_id=${breed_id}&limit=25`, {
            headers: ApiKey.headers
          }
        )
        const data = await res.json()
        setDog(data)
        console.log(data)
        setOpenLoading(false)
      } catch (error) {
        console.error(error)
      }
    }
    fetchSingleDogData()
  }, [breed_id])

  return (
    <div>
      {
        dog.length !==0 ? (
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.isOpen}
            onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
            sx={{ border: 'none', outline: 'none', backdropFilter: "blur(5px)"}}
          >
            <Fade in={props.isOpen}>
              <Box sx={style}>
                <Stack direction="column" justifyContent="center" alignItems="center" spacing={2}>
                  <Carousel 
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      textAlign: 'center'
                      }}
                      navButtonsAlwaysVisible={true}
                      indicatorContainerProps={{
                        style: {
                            marginTop: '0px', // 5
                        }
                      }}
                    swipe={true}  
                  >
                    {
                      dog.map((item:any) => (
                        <img
                          key={item.id}
                          src={item.url}
                          alt={item.breeds.name}
                          style={{
                            // width: '100%',
                            height: '60vh',
                            boxShadow: '0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)'
                          }}
                        />
                      ))
                    }
                  </Carousel>
                  <ShowBreedText dog={dog} />
                </Stack>
              </Box>
            </Fade>
          </Modal>
        ) : (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )
      }
      
    </div>
  );
}

export default DogModal