import {
  Container,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Chip,
  Skeleton,
  Box,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getActivities } from '../Service/api';
import { formatDate } from '../utils';

const ActivityHistory = () => {
  const { data, isLoading } = useQuery(['activities'], getActivities);

  const activities = data?.data?.data || [];

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'success';
      case 'UPDATE':
        return 'primary';
      case 'DELETE':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Activity History
      </Typography>
      <Card sx={{ mt: 3 }}>
        <CardContent>
          {isLoading ? (
            <List>
              {[...Array(10)].map((_, i) => (
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
          ) : activities.length === 0 ? (
            <Typography py={4} textAlign="center">
              No activities yet
            </Typography>
          ) : (
            <List>
              {activities.map((activity) => (
              <ListItem key={activity._id}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getActionColor(activity.action)}.main` }}>
                    {activity.action[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={2}>
                      <Typography fontWeight={500}>
                        {activity.action} {activity.entity}
                      </Typography>
                      <Chip
                        label={activity.action}
                        size="small"
                        color={getActionColor(activity.action)}
                      />
                    </Box>
                  }
                  secondary={formatDate(activity.createdAt)}
                />
              </ListItem>
            ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ActivityHistory;
