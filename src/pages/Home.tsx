import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { trackPromise } from 'react-promise-tracker';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import PetsIcon from '@mui/icons-material/Pets';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
// import { Masonry } from '@mui/lab';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import TitleIcon from '@mui/icons-material/Title';
import HeightIcon from '@mui/icons-material/Height';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import { pink } from '@mui/material/colors';
// components
// import { BackToTop } from '../components/BackToTop';
import DogModal from '../components/DogModal';
import ImageCard from '../components/ImageCard';
import ApiKey from '../components/ApiKey';
import { LoadingIndicator } from "../components/Spinner";

const errorImage:string = 'https://i3.cpcache.com/merchandise/110_750x750_Front_Color-White.jpg?Size=L&AttributeValue=NA&c=False&region={"name":"FrontCenter","width":8,"height":8,"alignment":"MiddleCenter","orientation":0,"dpi":100,"crop_x":0,"crop_y":0,"crop_h":800,"crop_w":800,"scale":0,"template":{"id":83534939,"params":{}}}&cid=PUartJBjiF%2fyg4FdKqiggQ%3d%3d+%7c%7c+X5nqL0YJgh%2fomegMbGBl%2bg%3d%3d&ProductNo=699196288'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href={`/`}>
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme({
  palette: {
    primary: pink,
    secondary: blue,
  },
});

export default function Home() {

  const [dogs, setDogs] = useState([])
  const [searchText, setSearchText] = useState("")
  const [isSearch, setIsSearch] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [breedId, setBreedId] = useState()
  const [alignment, setAlignment] = React.useState<string | null>('name');
  const [asc, setAsc] = React.useState<boolean | null>(true);

  const handleInputSearch = (e: ChangeEvent<HTMLInputElement>) => {
    let keyword = e.target.value.toLocaleLowerCase();
    setSearchText(keyword)
    console.log(keyword)
    keyword.length !== 0 ? setIsSearch(true) : setIsSearch(false) 
  }

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  const handleAsc = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    if(newAlignment === 'asc') {
      setAsc(true);
    } else {
      setAsc(false)
    }
  };

  // count the avg data
  const calcAvgHeight = (data:string) => {
    if (data.includes(' ')) {
      let a:any = data.split(' ')
      return (parseInt(a[0]) + parseInt(a[2])) / 2
    } else {
      return parseInt(data)
    }
  }

  const calcAvgLifespan = (data:string) => {
    if (data.includes('-')) {
      let a:any = data.split(' ')
      return parseInt(a[2])
    } else {
      return parseInt(data.split(' ')[0])
    }
  }

  // Sort functions
  const sortFunction = async (a:any, b:any) => {
    //a - name, height, lifspan
    //b - asc
    console.log(alignment)
    console.log(asc)
    if(a === 'name') {
      console.log('Sort by name')
      await dogs.sort((c:any, d:any) => {
        const comA = c.name.toUpperCase(); // ignore upper and lowercase
        const comB = d.name.toUpperCase(); // ignore upper and lowercase
        if(b) {
          return comA > comB ? 1 : -1
        } else {
          return comA > comB ? -1 : 1
        }
      })
    }
    if(a === 'height') {
      console.log('Sory by height')
      await dogs.sort((c:any, d:any) => {
        const comA = calcAvgHeight(c.height.metric); // calculate the avg height
        const comB = calcAvgHeight(d.height.metric); // calculate the avg height
        if(b) {
          return comA > comB ? 1 : -1
        } else {
          return comA > comB ? -1 : 1
        }
      })
    }
    if(a === 'lifespan') {
      console.log('Sort by lifespan')
      await dogs.sort((c:any, d:any) => {
        const comA = calcAvgLifespan(c.life_span); // calculate the avg height
        const comB = calcAvgLifespan(d.life_span); // calculate the avg height
        if(b) {
          return comA > comB ? 1 : -1
        } else {
          return comA > comB ? -1 : 1
        }
      })
    }
    console.log(dogs)
    setDogs([...dogs])
  }

  const fetchDogData = async () => {
    try {
      const res = await fetch(`${ApiKey.endpoint}v1/breeds`, {
        headers: ApiKey.headers
      });
      const data = await res.json();
      setDogs(data);
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  };

  const searchBreed = async (searchText:any) => {
    try {
      const res = await fetch(`${ApiKey.endpoint}v1/breeds/search?q=${searchText}`, {
        headers: ApiKey.headers
      });
      const data = await res.json();
      setDogs(data);
      console.log(data)
      console.log(isSearch)
    } catch (error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    if (isSearch) {
      const debounceRun = setTimeout(() => {
        trackPromise(searchBreed(searchText))
      }, 1000)
      return () => clearTimeout(debounceRun)
    } else {
      trackPromise(fetchDogData())
    }
  }, [searchText])

  useEffect(() => {
    console.log(alignment, asc)
    trackPromise(sortFunction(alignment, asc))
    console.log("--------------")
  }, [alignment, asc])

  const handleOpenModal = (breedId: any) => {
    setBreedId(breedId)
    setOpenModal(true)
  }

  const handleModalClose = () => {
    setOpenModal(false)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <PetsIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" sx={{ flexGrow: 1 }}>
            Love Dogs
          </Typography>
          <Button color="inherit" href={`/signin`}>SignIn</Button>
        </Toolbar>
      </AppBar>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="lg">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
              data-testid="home-title"
            >
              Find out your faviorate dogs 
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Find out your faviorate dogs 
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="standard-basic" 
                  label="Type Search Keyword..." 
                  variant="standard" 
                  sx={{ width: 300 }}
                  onChange={handleInputSearch}
                />
              </Box>
            </Stack>
          </Container>
        </Box>
        <Container>
          <ToggleButtonGroup
            value={alignment}
            size="small"
            color="primary"
            exclusive={true}
            onChange={handleAlignment}
            aria-label="Dog alignment"
          >
              <ToggleButton value="name" aria-label="name aligned">
                <Tooltip title="Sort by Name">
                  <TitleIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="height" aria-label="height aligned">
                <Tooltip title="Sort by Height">
                  <HeightIcon />
                </Tooltip>
              </ToggleButton>
              <ToggleButton value="lifespan" aria-label="lifespan aligned">
                <Tooltip title="Sort by Life span">
                  <HeartBrokenIcon />
                </Tooltip>
              </ToggleButton>
          </ToggleButtonGroup>
          {` `}
          <ToggleButtonGroup
            value={asc ? 'asc' : 'desc' }
            size="small"
            color="primary"
            exclusive
            onChange={handleAsc}
            aria-label="asc/desc alignment"
          >
              <ToggleButton value="asc" aria-label="asc aligned">
                <Tooltip title="Sort by ASC / DESC">
                  <SortByAlphaIcon />
                </Tooltip>
              </ToggleButton>
          </ToggleButtonGroup>
        </Container>
        <LoadingIndicator />
        <Container sx={{ py: 4 }} maxWidth="lg">
          
          {/* <Masonry defaultColumns={3} columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          { dogs.length > 0 ? (
              dogs.map((dog: any) => (
                <ImageCard 
                  key={dog.id}
                  dog = {dog}
                  isSearch={isSearch}
                  handleOpenModal={handleOpenModal}
                />
              ))
            ) : (
              <div className='errordiv' style={{width: '80%', textAlign: 'center'}}>
                <img
                  src={errorImage}
                  alt="Error"
                  style={{ height: 400 }}
                />
              </div>
            )
          }
          </Masonry> */}
          <ResponsiveMasonry
            columnsCountBreakPoints={{350: 1, 750: 2, 900: 3}}
          >
            <Masonry gutter="10px">
            { dogs.length > 0 ? (
                dogs.map((dog: any) => (
                  <ImageCard 
                    key={dog.id}
                    dog = {dog}
                    isSearch={isSearch}
                    handleOpenModal={handleOpenModal}
                  />
                ))
              ) : (
                <div className='errordiv' style={{width: '80%', textAlign: 'center'}}>
                  <img
                    src={errorImage}
                    alt="Error"
                    style={{ height: 400 }}
                  />
                </div>
              )
            }
            </Masonry>
          </ResponsiveMasonry>
        </Container>
        <DogModal isOpen={openModal} breed_id={breedId} handleClose={handleModalClose}/>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}