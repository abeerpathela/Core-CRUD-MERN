import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
} from '@mui/material';
import {
  People,
  PersonAdd,
  TrendingUp,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../Service/api';
import { formatDate } from '../utils';

const Dashboard = () => {
  const { data, isLoading } = useQuery(['dashboardStats'], getDashboardStats);

  const stats = data?.data?.data;

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <People fontSize="large" />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Users
                  </Typography>
                  {isLoading ? (
                    <Skeleton width={80} height={40} />
                  ) : (
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.totalUsers || 0}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                  <PersonAdd fontSize="large" />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    New This Month
                  </Typography>
                  {isLoading ? (
                    <Skeleton width={80} height={40} />
                  ) : (
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.usersCreatedThisMonth || 0}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
                </Avatar>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Recent Activities
                  </Typography>
                  {isLoading ? (
                    <Skeleton width={80} height={40} />
                  ) : (
                    <Typography variant="h3" fontWeight={700}>
                      {stats?.recentActivities?.length || 0}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Recent Activity
              </Typography>
              {isLoading ? (
                <List>
                  {[...Array(5)].map((_, i) => (
                    <ListItem key={i}>
                      <ListItemAvatar>
                        <Skeleton variant="circular" width={40} height={40} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Skeleton width={200} />}
                        secondary={<Skeleton width={150} />}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <List>
                  {stats?.recentActivities?.map((activity) => (
                    <ListItem key={activity._id}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor:
                              activity.action === 'CREATE'
                                ? 'success.main'
                                : activity.action === 'UPDATE'
                                ? 'primary.main'
                                : 'error.main',
                          }}
                        >
                          {activity.action[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${activity.action} User`}
                        secondary={formatDate(activity.createdAt)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
