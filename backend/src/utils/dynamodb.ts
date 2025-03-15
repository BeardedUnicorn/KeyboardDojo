import { DynamoDB } from 'aws-sdk';
import { User } from './auth';

// Initialize DynamoDB client
const dynamoDb = new DynamoDB.DocumentClient();
const usersTable = process.env.USERS_TABLE || '';
const lessonsTable = process.env.LESSONS_TABLE || '';
const progressTable = process.env.PROGRESS_TABLE || '';

/**
 * Get a user by ID
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const result = await dynamoDb
      .get({
        TableName: usersTable,
        Key: { userId },
      })
      .promise();

    return result.Item as User || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

/**
 * Get a user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const result = await dynamoDb
      .query({
        TableName: usersTable,
        IndexName: 'EmailIndex',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      })
      .promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as User;
    }

    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

/**
 * Create a new user
 */
export const createUser = async (user: User): Promise<boolean> => {
  try {
    await dynamoDb
      .put({
        TableName: usersTable,
        Item: user,
        ConditionExpression: 'attribute_not_exists(userId)',
      })
      .promise();

    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
};

/**
 * Update user
 */
export const updateUser = async (
  userId: string,
  updates: Partial<User>
): Promise<User | null> => {
  const updateExpressions: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  // Build update expression
  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'userId') {
      // Don't update primary key
      updateExpressions.push(`#${key} = :${key}`);
      expressionAttributeNames[`#${key}`] = key;
      expressionAttributeValues[`:${key}`] = value;
    }
  });

  if (updateExpressions.length === 0) {
    return null;
  }

  try {
    const result = await dynamoDb
      .update({
        TableName: usersTable,
        Key: { userId },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
      .promise();

    return result.Attributes as User;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

/**
 * Check if user exists by email
 */
export const userExistsByEmail = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  return !!user;
};

/**
 * Check if user exists by provider ID
 */
export const userExistsByProviderId = async (
  provider: string,
  providerId: string
): Promise<User | null> => {
  try {
    const result = await dynamoDb
      .scan({
        TableName: usersTable,
        FilterExpression: 'authProvider = :provider AND providerId = :providerId',
        ExpressionAttributeValues: {
          ':provider': provider,
          ':providerId': providerId,
        },
      })
      .promise();

    if (result.Items && result.Items.length > 0) {
      return result.Items[0] as User;
    }

    return null;
  } catch (error) {
    console.error('Error checking user by provider ID:', error);
    return null;
  }
};

/**
 * Export the dynamoDb client for use in other modules
 */
export { dynamoDb }; 