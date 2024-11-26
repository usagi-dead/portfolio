import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function ButtonAppBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Alexander Luchinovich
                    </Typography>
                    <Button color="inherit">GitHub →</Button>
                    <Button color="inherit">LinkedIn →</Button>
                    <Button color="inherit">Resume →</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
