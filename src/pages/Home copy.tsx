import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
// import { debounce } from 'lodash';
// import { useDebounce } from 'usehooks-ts'
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
// import CameraIcon from '@mui/icons-material/PhotoCamera';
import PetsIcon from '@mui/icons-material/Pets';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { Masonry } from '@mui/lab';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
// components
// import { BackToTop } from '../components/BackToTop';

import ApiKey from '../components/ApiKey';

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

const theme = createTheme();

export default function Home() {

  const [dogs, setDogs] = useState([])
  const [searchText, setSearchText] = useState("")

  const handleInputSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase())
  }

  const fetchDogData = async (url: string) => {
    try {
      const res = await fetch(url, {
        headers: ApiKey.headers
      });
      const data = await res.json();
      setDogs(data);
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    let api_url = searchText !== "" ? 
      `${ApiKey.endpoint}v1/breeds/search?q=${searchText}` : 
      `${ApiKey.endpoint}v1/breeds`
    
    const debounceRun = setTimeout(() => {
      fetchDogData(api_url);
    }, 1000)
    return () => clearTimeout(debounceRun)
  }, [searchText])

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
            >
              Dogs Album
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Something short and leading about the collection below—its contents,
              the creator, etc. Make it short and sweet, but not too short so folks
              don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              {/* Autocomplete searchbox */}
              <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  options={dogs.map((option: any) => option.name)}
                  sx={{ width: '80ch', borderRadius: '50%' }}
                  renderInput={(params) => 
                    <TextField 
                      {...params}  
                      variant="standard"
                      label="Search"
                      value={searchText}
                      onChange={handleInputSearch}
                      />
                    }
                    onClose={() => setSearchText("")}
                />
              </Box>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
            {dogs.length ? (
              dogs.map((dog: any) => (
                <ImageListItem key={dog.id}>
                  <img
                    src={`${dog.image.url}`}
                    alt={dog.name}
                    style={{width: '100%'}}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={dog.name}
                    subtitle={dog.bred_for}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                        aria-label={`info about ${dog.name}`}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))
            ) : (
              <h1>{`No Data`}</h1>
            )}
          </Masonry>
        </Container>
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