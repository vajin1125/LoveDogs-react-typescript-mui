import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CircularProgress from '@mui/material/CircularProgress';
import { Hearts } from 'react-loader-spinner';

const errorImage:string = 'https://i3.cpcache.com/merchandise/110_750x750_Front_Color-White.jpg?Size=L&AttributeValue=NA&c=False&region={"name":"FrontCenter","width":8,"height":8,"alignment":"MiddleCenter","orientation":0,"dpi":100,"crop_x":0,"crop_y":0,"crop_h":800,"crop_w":800,"scale":0,"template":{"id":83534939,"params":{}}}&cid=PUartJBjiF%2fyg4FdKqiggQ%3d%3d+%7c%7c+X5nqL0YJgh%2fomegMbGBl%2bg%3d%3d&ProductNo=699196288'

const ImageCard = (props:any) => {

  const [loaded, setLoaded] = useState(false)

  const imageSrc = () => {
    return !props.isSearch && typeof props.dog.image!== 'undefined' ? props.dog.image.url : `https://cdn2.thedogapi.com/images/${props.dog.reference_image_id}.jpg`
  }

  const handleLoaded = () => {
    setLoaded(true)
  }

  const onImageError = (e:any) => {
    e.target.src = errorImage
  }

  return(
    <ImageListItem key={props.dog.id} data-testid="dog-card">
      { loaded ? null : 
        <div style={{ width:'100%', height:300 }}>
          {/* <Hearts 
            height="100"
            width="100"
            color="#f50057"
            ariaLabel="hearts-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          /> */}
          <CircularProgress />
        </div>
      }
        <img
          className='dogCardImg'
          style={loaded ? {} : { display: 'none' }}
          src={imageSrc()}
          alt={props.dog.name}
          loading="lazy"
          onClick={() => props.handleOpenModal(props.dog.id)}
          onError={(e) => onImageError(e)}
          onLoad={() => handleLoaded()}
        />
      
      
      <ImageListItemBar
        title={props.dog.name}
        subtitle={props.dog.bred_for ?? props.dog.breed_group}
        actionIcon={
          <IconButton
            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
            aria-label={`info about ${props.dog.name}`}
          >
            <StarBorderIcon/>
          </IconButton>
        }
      />
    </ImageListItem>
  )
}
export default ImageCard;