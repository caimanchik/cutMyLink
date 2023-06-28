from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import LinkSerializer


class CreateLink(APIView):
    # todo

    @staticmethod
    def post(request):
        serializer = LinkSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            link = serializer.create(data=serializer.validated_data)
            return Response(LinkSerializer(link).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetLink(APIView):

    @staticmethod
    def get(request):
        LinkSerializer.get()