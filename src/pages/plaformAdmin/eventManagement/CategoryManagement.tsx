import React, { useState } from 'react';
import {
    Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,
    Dialog, DialogActions, DialogContent, DialogTitle, TextField, Switch, FormControlLabel, Chip,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { blue, green, orange, red, grey, purple } from '@mui/material/colors';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';

// Define a custom Material-UI theme for consistent styling
const theme = createTheme({
    palette: {
        primary: {
            main: blue[700],
        },
        secondary: {
            main: green[500],
        },
        error: {
            main: red[500],
        },
        warning: {
            main: orange[500],
        },
        info: {
            main: purple[500],
        },
        text: {
            secondary: grey[600],
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: '2rem',
        },
        h5: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.875rem',
            color: '#6b7280',
        },
        subtitle1: {
            fontWeight: 600,
            fontSize: '1.1rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '0.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    textTransform: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                },
            },
        },
    },
});

// Sample Data for Categories
const initialCategories = [
    {
        id: 'cat_1',
        category_name: 'Music Concerts',
        description: 'Live performances by various artists and bands across genres.',
        icon_url: 'https://placehold.co/40x40/FF5722/ffffff?text=Music',
        is_active: true,
    },
    {
        id: 'cat_2',
        category_name: 'Sports Events',
        description: 'Competitions and matches including football, basketball, marathons, etc.',
        icon_url: 'https://placehold.co/40x40/4CAF50/ffffff?text=Sports',
        is_active: true,
    },
    {
        id: 'cat_3',
        category_name: 'Art & Culture',
        description: 'Exhibitions, theater plays, dance performances, and cultural festivals.',
        icon_url: 'https://placehold.co/40x40/9C27B0/ffffff?text=Art',
        is_active: true,
    },
    {
        id: 'cat_4',
        category_name: 'Workshops & Classes',
        description: 'Educational and skill-building sessions on various topics.',
        icon_url: 'https://placehold.co/40x40/FFC107/000000?text=Learn',
        is_active: false, // Deactivated category
    },
    {
        id: 'cat_5',
        category_name: 'Food & Drink',
        description: 'Culinary events, food festivals, wine tastings, and cooking classes.',
        icon_url: 'https://placehold.co/40x40/795548/ffffff?text=Food',
        is_active: true,
    },
];

export const CategoryManagement = () => {
    const [categories, setCategories] = useState(initialCategories);
    const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
    const [openDeleteConfirmDialog, setOpenDeleteConfirmDialog] = useState(false);

    const [currentCategory, setCurrentCategory] = useState(null);
    const [isNewCategory, setIsNewCategory] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Handlers for Category Management
    const handleOpenCreateCategory = () => {
        setCurrentCategory({ id: `cat_${Date.now()}`, category_name: '', description: '', icon_url: '', is_active: true });
        setIsNewCategory(true);
        setOpenCategoryDialog(true);
    };

    const handleEditCategory = (category) => {
        setCurrentCategory({ ...category });
        setIsNewCategory(false);
        setOpenCategoryDialog(true);
    };

    const handleSaveCategory = () => {
        if (!currentCategory.category_name.trim()) {
            console.error("Category name cannot be empty.");
            return;
        }

        if (isNewCategory) {
            setCategories([...categories, currentCategory]);
        } else {
            setCategories(categories.map(c => c.id === currentCategory.id ? currentCategory : c));
        }
        setOpenCategoryDialog(false);
        setCurrentCategory(null);
    };

    const handleDeleteCategory = (category) => {
        setCurrentCategory(category);
        setOpenDeleteConfirmDialog(true);
    };

    const confirmDeleteCategory = () => {
        setCategories(categories.filter(c => c.id !== currentCategory.id));
        setOpenDeleteConfirmDialog(false);
        setCurrentCategory(null);
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ThemeProvider theme={theme}>
            <Box className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-screen">
                {/* All Categories Section */}
                <Box className="mb-8">
                    <Typography variant="h5" className="mb-4 text-gray-700 flex items-center">
                        <CategoryIcon className="mr-2" color="primary" /> All Categories
                    </Typography>
                    <Paper className="p-4 bg-white rounded-xl shadow-lg">
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <TextField
                                label="Search Categories by Name or Description"
                                variant="outlined"
                                fullWidth
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <SearchIcon color="action" sx={{ mr: 1 }} />
                                    ),
                                }}
                            />
                            <Button variant="contained" color="primary" startIcon={<AddIcon />} sx={{ ml: 2, minWidth: '150px' }} onClick={handleOpenCreateCategory}>
                                Add New Category
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Category Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {category.icon_url && (
                                                            <img src={category.icon_url} alt={category.category_name} style={{ width: '30px', height: '30px', objectFit: 'contain', marginRight: '8px' }} />
                                                        )}
                                                        {category.category_name}
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {category.description}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={category.is_active ? 'Active' : 'Inactive'}
                                                        color={category.is_active ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton aria-label="edit" onClick={() => handleEditCategory(category)}>
                                                        <EditIcon color="primary" />
                                                    </IconButton>
                                                    <IconButton aria-label="delete" onClick={() => handleDeleteCategory(category)}>
                                                        <DeleteIcon color="error" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="body1" color="text.secondary" sx={{ py: 2 }}>
                                                    No categories found matching your search.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {/* Dialog for Create/Edit Category */}
                {currentCategory && (
                    <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} maxWidth="sm" fullWidth>
                        <DialogTitle>{isNewCategory ? 'Add New Category' : `Edit Category: ${currentCategory.category_name}`}</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Category Name"
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={currentCategory.category_name}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, category_name: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Description"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                value={currentCategory.description}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, description: e.target.value })}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Icon URL"
                                type="url"
                                fullWidth
                                variant="outlined"
                                value={currentCategory.icon_url}
                                onChange={(e) => setCurrentCategory({ ...currentCategory, icon_url: e.target.value })}
                                sx={{ mb: 2 }}
                                helperText="Provide a URL for the category icon (e.g., https://placehold.co/40x40/FF5722/ffffff?text=Icon)"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={currentCategory.is_active}
                                        onChange={(e) => setCurrentCategory({ ...currentCategory, is_active: e.target.checked })}
                                        color="primary"
                                    />
                                }
                                label="Is Active"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
                            <Button onClick={handleSaveCategory} variant="contained" color="primary">Save Category</Button>
                        </DialogActions>
                    </Dialog>
                )}

                {/* Delete Confirmation Dialog */}
                {currentCategory && (
                    <Dialog open={openDeleteConfirmDialog} onClose={() => setOpenDeleteConfirmDialog(false)}>
                        <DialogTitle>Confirm Delete Category</DialogTitle>
                        <DialogContent>
                            <Typography>
                                Are you sure you want to delete the category "{currentCategory.category_name}"?
                                This action cannot be undone. Associated events might lose their category assignment.
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDeleteConfirmDialog(false)}>Cancel</Button>
                            <Button onClick={confirmDeleteCategory} variant="contained" color="error">Delete Category</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default CategoryManagement;
