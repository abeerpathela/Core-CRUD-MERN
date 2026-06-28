import { useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
  Typography,
  Skeleton,
  Avatar,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../Service/api';
import { PAGINATION_LIMIT } from '../constants';
import { getInitials } from '../utils';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

const AllUsers = () => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, id: null });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ['users', page, search],
    () => getUsers({ page: page + 1, limit: PAGINATION_LIMIT, search })
  );

  const deleteMutation = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['dashboardStats']);
      queryClient.invalidateQueries(['activities']);
      setToast({ open: true, message: 'User deleted successfully', severity: 'success' });
    },
    onError: () => {
      setToast({ open: true, message: 'Failed to delete user', severity: 'error' });
    },
  });

  const users = data?.data?.data?.users || [];
  const total = data?.data?.data?.pagination?.total || 0;

  const handleDeleteClick = (id) => {
    setConfirmDialog({ open: true, id });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(confirmDialog.id);
    setConfirmDialog({ open: false, id: null });
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          All Users
        </Typography>
        <Button
          component={Link}
          to="/add"
          variant="contained"
          size="large"
        >
          Add User
        </Button>
      </Box>
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search users by name, username, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton width={150} />
                    </Box>
                  </TableCell>
                  <TableCell><Skeleton width={120} /></TableCell>
                  <TableCell><Skeleton width={180} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                  <TableCell><Skeleton width={100} /></TableCell>
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography py={3}>No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography fontWeight={500}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton component={Link} to={`/edit/${user._id}`} color="primary">
                        <Edit />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(user._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={PAGINATION_LIMIT}
          rowsPerPageOptions={[PAGINATION_LIMIT]}
        />
      </TableContainer>
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={() => setToast({ ...toast, open: false })}
      />
      <ConfirmDialog
        open={confirmDialog.open}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog({ open: false, id: null })}
      />
    </Container>
  );
};

export default AllUsers;
