import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Skeleton,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, editUser } from '../Service/api';
import Toast from '../components/Toast';

const EditUser = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userData, isLoading } = useQuery(['user', id], () => getUserById(id));

  useEffect(() => {
    if (userData?.data?.data) {
      setFormData(userData.data.data);
    }
  }, [userData]);

  const mutation = useMutation((data) => editUser(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['dashboardStats']);
      queryClient.invalidateQueries(['activities']);
      setToast({ open: true, message: 'User updated successfully', severity: 'success' });
      setTimeout(() => navigate('/users'), 1500);
    },
    onError: (error) => {
      const err = error.response?.data?.errors || { general: 'Failed to update user' };
      setErrors(err);
      setToast({
        open: true,
        message: error.response?.data?.message || 'Failed to update user',
        severity: 'error',
      });
    },
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm">
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Skeleton height={40} width={200} sx={{ mx: 'auto', mb: 4 }} />
            <Grid container spacing={3}>
              {[...Array(4)].map((_, i) => (
                <Grid item xs={12} key={i}>
                  <Skeleton height={56} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Skeleton height={48} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom align="center">
            Edit User
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={mutation.isLoading}
                >
                  {mutation.isLoading ? 'Updating...' : 'Update User'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
};

export default EditUser;
