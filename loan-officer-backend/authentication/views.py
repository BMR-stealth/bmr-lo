from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.contrib.auth import get_user_model
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from django.conf import settings
from datetime import timedelta

User = get_user_model()

# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save(request)
            return Response({
                'message': 'Registration successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    # Format validation errors for better readability
    formatted_errors = {}
    for field, errors in serializer.errors.items():
        if isinstance(errors, list):
            formatted_errors[field] = [str(error) for error in errors]
        else:
            formatted_errors[field] = str(errors)
    
    return Response(formatted_errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        # First try to get the user by email
        user = User.objects.get(email=email)
        
        # Verify this is a lender account
        if user.role != 'LENDER':
            return Response({
                'error': 'Access denied. This portal is for lenders only.'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Now authenticate the user
        auth_user = authenticate(request, username=email, password=password)
        if auth_user is not None:
            login(request, auth_user, backend='django.contrib.auth.backends.ModelBackend')
            
            # Prepare user data for response
            user_data = {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'company_name': user.company_name,
                'phone_number': user.phone_number,
                'location': user.location
            }
            
            return Response({
                'message': 'Login successful',
                'user': user_data
            })
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except User.DoesNotExist:
        return Response({
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    return Response({'csrfToken': get_token(request)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_view(request):
    if not request.user.is_lender:
        return Response({
            'error': 'Access denied. This portal is for lenders only.'
        }, status=status.HTTP_403_FORBIDDEN)
        
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
